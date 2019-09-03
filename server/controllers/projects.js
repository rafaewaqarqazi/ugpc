const Projects = require('../models/projects');
const Users = require('../models/users');
const mongoose = require('mongoose')
const {sendEmail} = require("../helpers");
const moment = require('moment');
const _ = require('lodash');

exports.getAllProjects = (req, res)=>{
    Projects.find()
        .populate('students','_id name')
        .then(projects => {
            res.json(projects);
        })
        .catch(err => res.status(400).json({error:err}))
};
exports.findByStudentId = (req,res,next,id)=>{

    Projects.find({students:id})
        .populate('students','_id name department student_details')
        .populate('documentation.visionDocument.comments.author','_id name role department')
        .then(project => {
            req.project = project;
            next()
        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};

exports.createProject = (req, res) => {

    const project = new Projects(req.body);
    project.save()
        .then(data => res.json(data))
        .catch(err => res.json({error:err}))
};

exports.fetchWaitingVisionDocuments = (req, res)=>{
    Projects.aggregate([
        {
            $unwind:"$documentation.visionDocument"
        },
        {
            $project:{"documentation.visionDocument":1}
        },
        {
            $match:{"documentation.visionDocument.status":"Waiting for Initial Approval"}
        },
        {
            $sort:{"documentation.visionDocument.uploadedAt":1}
        }
    ])
        .then(documents =>{
            res.json(documents)
        })
        .catch(err => res.status(400).json(err.message))
};

exports.fetchVisionDocsByCommitteeCoordinator =async (req, res)=>{
    try {
        //Waiting For Initial approval Query
        const waitingResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Waiting for Initial Approval"}},
            {$sort:{"documentation.visionDocument.uploadedAt":1}}
        ]);
        const waiting = await Projects.populate(waitingResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'}
            ]);
        //Waiting For Meeting Schedule Query
        const approvedForMeetingResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved for Meeting"}},
            {$sort:{"documentation.visionDocument.uploadedAt":1}}
        ]);
        const approvedForMeeting = await Projects.populate(approvedForMeetingResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'}
        ]);
        //Meeting Scheduled Query
        const meetingScheduledResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Meeting Scheduled"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const meetingScheduled = await Projects.populate(meetingScheduledResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'}
        ]);
        //Approved with Changes Query
        const approvedWithChangesResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1,"details.acceptanceLetter":1,"details.supervisor":1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved With Changes"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approvedWithChanges = await Projects.populate(approvedWithChangesResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'},
            {path:"details.supervisor",select:'_id name supervisor_details.position'}
        ])

        //Approved Query

        const approvedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1,"details.acceptanceLetter":1,"details.supervisor":1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approved = await Projects.populate(approvedResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'},
            {path:"details.supervisor",select:'_id name supervisor_details.position'}
        ])

        //Rejected Query
        const rejectedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Rejected"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const rejected = await Projects.populate(rejectedResults,[
            {path:"students",select:'_id name department student_details.regNo'},
            {path:"documentation.visionDocument.comments.author",select:'_id name role department'},
        ])
        await res.json({waiting,approvedForMeeting,meetingScheduled,approvedWithChanges,approved,rejected})
    }
    catch(err){
        res.status(400).json(err.message)
    }
};

exports.commentOnVision = (req, res) =>{
    const {text, projectId,documentId,author} = req.body;
    Projects.update(
        {"_id":projectId, "documentation.visionDocument._id":documentId},
        {
            $push:{
                "documentation.visionDocument.$.comments":{
                    text:text,
                    createdAt:Date.now(),
                    author:author
                }
            }
        }
    ).then(result => {
        res.json(result)
    })
        .catch(err => res.json(err))
}

exports.changeStatus = (req, res)=>{
    const {status, projectId,documentId} = req.body;
    Projects.update(
        {"_id":projectId, "documentation.visionDocument._id":documentId},
        {
            $set:{
                "documentation.visionDocument.$.status":status,
                "documentation.visionDocument.$.updatedAt":Date.now()
            }
        }
    ).then(result => {
        res.json(result)
    })
        .catch(err => res.json(err))
}

exports.scheduleVisionDefence = async (req,res)=>{
    try {
        const {projectIds,visionDocsIds,date} = req.body;
        const pIds = projectIds.map(id => mongoose.Types.ObjectId(id));
        const result = await Projects.updateMany(
            {"_id":{$in:projectIds},"documentation.visionDocument._id":{$in:visionDocsIds}},
            {
                $set:{
                    "documentation.visionDocument.$.status":'Meeting Scheduled',
                    "documentation.visionDocument.$.updatedAt":Date.now(),
                    "documentation.visionDocument.$.meetingDate":date,
                }
            }
        );
        const studentsResult = await Projects.aggregate([
            {$match:{"_id":{$in:pIds}}},
            {$project:{"_id":-1,students:1}},
        ]);
        const students = await Projects.populate(studentsResult,{path:"students",select:'-_id email'});
        let emails =[];
        await students.map(student => student.students.map(e=>{emails=[...emails,e.email]}));

        //Sending Email

        const emailData = {
            from: "noreply@node-react.com",
            to: emails,
            subject: "Proposal Defence Schedule",
            text: `Dear Student,\nYour Proposal Defence is scheduled on ${moment(date).format('LLL')}.\nYou need to upload Your presentation in ppt/pptx before ${moment(date).format('LLL')}.\nNote:Please be on time otherwise you will be placed at the end of the list`,
            html: `
                <p>Dear Student,</p>
                <p>Your Proposal Defence is Scheduled on ${moment(date).format('LLL')}.</p>
                <p>You need to upload Your presentation in ppt/pptx before ${moment(date).format('LLL')}</p>
                <p><b>Note:</b>Please be on time otherwise you will be placed at the end of the list</p>
            `
        };

        sendEmail(emailData)
            .then(()=>{
                return  res.json({message:'Success'})
            });
    }
    catch (e) {
        await res.json({error:e.message})
    }


};

exports.fetchMeetings =async (req,res)=>{
    const projectsResult = await Projects.aggregate([
                                {
                                    $unwind:"$documentation.visionDocument"
                                },
                                {
                                  $project:{documentation:1,title:1,department:1,students:1}
                                },
                                {
                                    $match:{$and:[{"documentation.visionDocument.status":"Meeting Scheduled"},{"department":req.params.committee}]}
                                },
                                {
                                    $group:{
                                        "_id":"$documentation.visionDocument.meetingDate",
                                        projects:{$push:"$$ROOT"}
                                    }
                                },
                            ]);
    const projects =await Projects.populate(projectsResult,[
        {path:'projects.students',model:'Users',select:'-_id name department student_details.regNo'},
        {path:'projects.documentation.visionDocument.comments.author',model:'Users',select:'-_id name ugpc_details'}
    ])
    await res.json(projects)
};

exports.assignSupervisor = async (req,res)=>{
    try {
        const {projectId,title} = req.body;
        //Finding Supervisor with minimum Numbers of Projects
        const supervisors =await Users.aggregate([
            {$match:{"additionalRole":'Supervisor'}},
            {
                $project:{
                    email:1,
                    name:1,
                    projectsCount:{
                        $cond: {
                            if: {
                                $isArray: "$supervisor_details.projects"
                            }, then: {
                                $size: "$supervisor_details.projects"
                            }, else: "0"
                        }}
                }
            },
            {$sort:{projectsCount: -1}},
            {
                $group:{
                    "_id":"$projectsCount",
                    details:{$push:"$$ROOT"},
                }
            },
        ]);

        //Choosing Supervisor Randomly from minimum Numbers
        const supervisor = await _.sample(supervisors[0].details);

        //Assigning Supervisor-Updating Project
        const project =await Projects.findOneAndUpdate(projectId,{"details.supervisor":supervisor._id})
            .populate('students','-_id email student_details.regNo')
            .select('students title');
        const studentEmails =await project.students.map(student => student.email);

        //Assigning Supervisor-Updating Supervisor
        const a = await Users.updateOne({_id:supervisor._id},{
            $push:{
                "supervisor_details.projects":projectId
            }
        })

        //Sending Emails

        const supervisorEmailData = {
            from: "noreply@node-react.com",
            to: supervisor.email,
            subject: "Project Assigned",
            text: `Dear Supervisor,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You`,
            html: `
                <p>Dear Supervisor,</p>
                <p>The Project named as: ${project.title}</p>
                <p>And students with Registration Numbers:</p>
                ${project.students.map(student => `<p>${student.student_details.regNo}</p>`)}
                <p>is assigned to you</p>
            `
        };
        const studentsEmailData = {
            from: "noreply@node-react.com",
            to: studentEmails,
            subject: "Supervisor Assigned",
            text: `Dear Student,\n Name: ${supervisor.name}\n email:${supervisor.email}\n is assigned to your Project as a Supervisor`,
            html: `
                <p>Dear Student,</p>
                <p><b>Name: </b> ${supervisor.name}</p>
                <p><b>Email: </b> ${supervisor.email}</p>
                <p>is Assigned to your Project as a Supervisor </p>
            `
        };
        await sendEmail(supervisorEmailData);
        await sendEmail(studentsEmailData);
        await res.json({success:'Assigned'})
    }
    catch (e) {
        await res.json({error:e.message})
    }

};

exports.generateAcceptanceLetter = async (req, res)=>{
    const {projectId,regNo} = req.body;
    const date = Date.now();
    const result= await Projects.updateOne(
        {"_id":projectId},
        {
            $set:{
                "details.acceptanceLetter":{
                        name:`${regNo}.pdf`,
                        issueDate:date
                    }

            }
        }
        );
    if (result.ok){
        await res.json({issueDate:date})
    }
}