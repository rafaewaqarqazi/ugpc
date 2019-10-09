const Projects = require('../models/projects');
const Users = require('../models/users');
const mongoose = require('mongoose');
const {sendEmail} = require("../helpers");
const moment = require('moment');
const _ = require('lodash');

exports.getAllProjects = (req, res)=>{
    Projects.aggregate([
        {$unwind:"$documentation.visionDocument"},
        {
            $match:{$or:[{"documentation.visionDocument.status":"Approved"},{"documentation.visionDocument.status":"Approved With Changes"}]}
        },
        {
            $project:{
                "documentation.visionDocument.title":1,
                "details.backlog":1,
                "details.sprint":1,
                "details.acceptanceLetter.issueDate":1,
                "details.estimatedDeadline":1
            }
        }
    ])
    .then(projects => {
        res.json(projects);
    })
    .catch(err => res.status(400).json({error:err}))
};
exports.findByStudentId = (req,res,next,id)=>{

    Projects.find({students:id})
        .populate('students','_id name department student_details')
        .populate('documentation.visionDocument.comments.author','_id name role department')
        .populate('details.supervisor','_id name supervisor_details.position')
        .populate('details.backlog.assignee', '_id name department student_details')
        .populate('details.backlog.createdBy', 'name')
        .populate({path:'details.sprint.todos.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.todos.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.inProgress.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.inProgress.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.inReview.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.inReview.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.done.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.done.createdBy',model:'Users',select:'name'})
        .then(project => {
            req.project = project[0];
            next()
        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};
exports.findByProjectId = (req,res,next,id)=>{

    Projects.findById(id)
        .populate('students','_id name department student_details')
        .populate('documentation.visionDocument.comments.author','_id name role department')
        .populate('details.supervisor','_id name supervisor_details.position')
        .populate('details.backlog.assignee', '_id name department student_details')
        .populate('details.backlog.createdBy', 'name')
        .populate({path:'details.sprint.todos.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.todos.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.inProgress.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.inProgress.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.inReview.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.inReview.createdBy',model:'Users',select:'name'})
        .populate({path:'details.sprint.done.assignee',model:'Users',select:'name department student_details email'})
        .populate({path:'details.sprint.done.createdBy',model:'Users',select:'name'})
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


exports.assignSupervisor = async (req,res)=>{
    try {
        const {projectId,title,regNo} = req.body;
        //Finding Supervisor with minimum Numbers of Projects
        const supervisors =await Users.aggregate([
            {$match:{"role":'Supervisor'}},
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
        if (supervisors.length === 0){
            await res.json({error:'Seems like no Supervisor has been registered Yet!'})
        }
        const supervisor = await _.sample(supervisors[0].details);
        const date = Date.now();
        const estimatedDeadline =  moment(date).add(4,'M').add(1,'d').startOf('d');
        //Assigning Supervisor-Updating Project
        const result = await Projects.updateOne({_id:projectId},
            {
                $set:{
                    "details.supervisor": supervisor._id,
                    "details.acceptanceLetter":{
                        name:`${regNo}.pdf`,
                        issueDate:date
                    },
                    "details.estimatedDeadline":estimatedDeadline
                }
            });
        const project =await Projects.findOne({_id:projectId}).populate('students','-_id email student_details.regNo')
            .select('students title details.supervisor')
            .populate({path:'details.supervisor',model:'Users',select:'name supervisor_details.position'});

        const studentEmails =await project.students.map(student => student.email);

        //Adding Project to Supervisor Details
        const a = await Users.updateOne({_id:supervisor._id},{
            $push:{
                "supervisor_details.projects":{
                    project:projectId,
                    title
                }
            }
        })

        //Sending Emails

        const supervisorEmailData = {
            from: "noreply@node-react.com",
            to: supervisor.email,
            subject: "Project Assigned | Supervision",
            text: `Dear Supervisor,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You`,
            html: `
                <p>Dear Supervisor,</p>
                <p>The Project named as: ${title}</p>
                <p>And students with Registration Numbers:</p>
                ${project.students.map(student => `<p>${student.student_details.regNo}</p>`)}
                <p>is assigned to you for supervision</p>
                <br/>
                <p>Regards!</p>
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
        await res.json({success:'Assigned',supervisor:project.details.supervisor})
    }
    catch (e) {
        await res.json({error:e.message})
    }

};

exports.generateAcceptanceLetter = async (req, res)=>{
    const {projectId,regNo} = req.body;
    const date = Date.now();
    const estimatedDeadline =  moment(date).add(4,'M').add(1,'d').startOf('d');
    const result= await Projects.updateOne(
        {"_id":projectId},
        {
            $set:{
                "details.acceptanceLetter":{
                        name:`${regNo}.pdf`,
                        issueDate:date
                    },
                "details.estimatedDeadline":estimatedDeadline
            }
        }
        );
    if (result.ok){
        await res.json({issueDate:date})
    }
};

exports.fetchFinalDocumentationsBySupervisor = async (req,res)=>{
    try {
        const {supervisorId} = req.params;
        const result = await Projects.find({"details.supervisor":supervisorId})
            .select('documentation.finalDocumentation documentation.visionDocument.title documentation.visionDocument.status students details.estimatedDeadline department')
            .populate('students','name student_details');
        await res.json(result)
    }catch (e) {
        await res.json(e.message)
    }
};

exports.changeFDStatus = async (req,res)=>{
    try {
        console.log('change Status');
        const {status,projectId,documentId,comment} = req.body;
        const result = await Projects.findOneAndUpdate({"_id":projectId,"documentation.finalDocumentation._id":documentId},
            {
                $set:{
                    "documentation.finalDocumentation.$.status":status,
                }
            })
            .select('students')
            .populate('students','email')
        //Sending Emails
        const emails = await result.students.map(student => student.email);
        const studentEmailData = {
            from: "noreply@node-react.com",
            to: emails,
            subject: "Project Evaluation Status Changed",
            text: `Dear Student,\nYour Project's Evaluation status has changed to ${status},\nRegards`,
            html: `
                <p>Dear Student,</p>
                <p>Your Project's Evaluation status has changed to <b>${status}</b></p>
                ${comment !== undefined ? `<p><b>Comments:</b> ${comment}</p>` :''}
                <br/>
                <p>Learn About Evaluation Statuses:</p>
                <p><b>NotApproved:</b> Your Documentation is rejected by supervisor or it needs changes.</p>
                <p><b>Approved:</b> Your Documentation is accepted by supervisor.</p>
                <p><b>Available for Internal:</b> Your Project is sent to evaluation Committee for internal scheduling.</p>
                <p><b>Internal Scheduled:</b> Your Project's internal is scheduled.</p>
                <p><b>Available for external:</b> Your Project is send to evaluation committee for external scheduling.</p>
                <p><b>Complete:</b> Your Evaluation Process is Completed.</p>
                <p>Regards!</p>
            `
        };
        await sendEmail(studentEmailData);
        await res.json({message:'Success'})
    }catch (e) {
        await res.json(e.message)
    }
};

exports.fetchForEvaluation = async (req,res) =>{
    try {
        const {committees} = req.query;
        const result = await Projects.aggregate([
            {$match:{"department":{$in:committees}}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{
                $or:[{"documentation.visionDocument.status":'Approved'},{"documentation.visionDocument.status":'Approved With Changes'}]
                }
            },
            {
                $project:{
                    "department":1,
                    "documentation.visionDocument.title":1,
                    "documentation.finalDocumentation":1,
                    "details.marks":1,
                    "details.internal":1,
                    "details.external":1,
                    "details.supervisor":1
                }
            },
            {$unwind: "$documentation.finalDocumentation"},
            {
                $match:{
                    "documentation.finalDocumentation.status":{$nin:['Waiting for Approval','Approved']}
                }
            }
        ]);
        const projects = await Projects.populate(result,[
            {path:"details.supervisor",model:'Users',select:"name supervisor_details.position"},
            {path:"details.internal.examiner",model:'Users',select:"name ugpc_details.designation"},
            {path:"details.external.examiner",model:'Users',select:"name ugpc_details.designation"},
        ])
        await res.json(projects)
    }catch (e) {
        await res.json(e.message)
    }
};

exports.scheduleInternal = async (req,res)=>{
    try {
        const {venue,selectedDate,projectId,originalname,filename,title,supervisorId} = req.body;
        //Finding Examiner with minimum Numbers of Projects
        const examiners =await Users.aggregate([
            {$match:{
                $and:[
                    {"ugpc_details.committeeType":'Evaluation'},
                    {"_id":{$ne:mongoose.Types.ObjectId(supervisorId)}
                    }]
            }},
            {
                $project:{
                    email:1,
                    name:1,
                    projectsCount:{
                        $cond: {
                            if: {
                                $isArray: "$ugpc_details.projects"
                            }, then: {
                                $size: "$ugpc_details.projects"
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

        //Choosing Examiner Randomly from minimum Numbers
        if (examiners.length === 0){
            await res.json({error:'Seems like no Examiner has been registered Yet!'})
        }
        const examiner = await _.sample(examiners[0].details);

        //Assigning Supervisor-Updating Project
        const project =await Projects.findOneAndUpdate(projectId,
            {
                "details.internal.examiner":examiner._id,
                "details.internal.date":selectedDate
            },
            {new:true}
        ).populate('students','-_id name email student_details.regNo')
            .populate({path:'details.internal.examiner',model:'Users',select:'name ugpc_details.designation'})
            .populate({path:'details.external.examiner',model:'Users',select:'name ugpc_details.designation'})
            .select('students title details.supervisor');
        const studentEmails =await project.students.map(student => student.email);

        //Adding Project to Examiner Details
        const a = await Users.updateOne({_id:examiner._id},{
            $push:{
                "ugpc_details.projects":{
                    project:projectId
                }
            }
        });

        //Sending Emails

        const examinerEmailData = {
            from: "noreply@node-react.com",
            to: examiner.email,
            subject: "Project Assigned | Internal Evaluation",
            text: `Dear Examiner,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You for Internal Evaluation`,
            html: `
                <p>Dear Sir,</p>
                <p>We are pleased to inform you that you have been appointed as Internal examiner for the evaluation of the project submitted by,</p>
                 ${project.students.map((student,index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' :''}</b></p>`)}
                <p>The Title of Project is: ${title}</p>
                <br/>
                <p> Venue and Date is given below.</p>
                <p><b>Venue: </b>${venue}</p>
                <p><b>Date: </b> ${moment(selectedDate).format('MMM DD, YYYY')}</p>
                <br/>
                <p>Regard!</p>
            `,
            attachments:[{filename:originalname,path:`${process.env.CLIENT_URL}/static/pdf/${filename}`}]
        };
        const studentsEmailData = {
            from: "noreply@node-react.com",
            to: studentEmails,
            subject: "Internal Scheduled",
            text: `Dear Student,\n Name: ${examiner.name}\n email:${examiner.email}\n is assigned to your Project as an Internal Examiner`,
            html: `
                <p>Dear Student,</p>
                <p><b>Name: </b> ${examiner.name}</p>
                <p><b>Email: </b> ${examiner.email}</p>
                <p>is Assigned to your Project as an Internal Examiner. Venue and Date is given below.</p>
                <br/>
                <p><b>Venue: </b>${venue}</p>
                <p><b>Date: </b> ${moment(selectedDate).format('LLL')}</p>
                <p>Regard!</p>
            `
        };
        await sendEmail(examinerEmailData);
        await sendEmail(studentsEmailData);
        await res.json({success:'Assigned',examiner:project.details.internal.examiner})
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.scheduleExternalDate = async (req,res)=>{
    try {
        const {venue,selectedDate,projectId} = req.body;

        //Assigning ExternalDate Project
        const project =await Projects.findOneAndUpdate(projectId,
            {
                "details.external.date":selectedDate
            },
            {new:true}
        ).populate('students','-_id email student_details.regNo')
            .populate({path:'details.internal.examiner',model:'Users',select:'name ugpc_details.designation'})
            .populate({path:'details.external.examiner',model:'Users',select:'name ugpc_details.designation'})
            .select('students title details.supervisor');
        const studentEmails =await project.students.map(student => student.email);


        //Sending Emails

        const studentsEmailData = {
            from: "noreply@node-react.com",
            to: studentEmails,
            subject: "External Scheduled",
            text: `Dear Student,\n Your External is scheduled by examiner on ${selectedDate} at ${venue}`,
            html: `
                <p>Dear Student,</p>
                <p>Your External Viva-Voce is scheduled by your Examiner, details are given below.</p>
                <br/>
                <p><b>Venue: </b>${venue}</p>
                <p><b>Date: </b> ${moment(selectedDate).format('LLL')}</p>
                <p>Regard!</p>
            `
        };
        await sendEmail(studentsEmailData);
        await res.json({success:'Scheduled'})
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.assignExternalAuto = async (req,res)=>{
    try {
        const {projectId,originalname,filename,title,supervisorId} = req.body;
        //Finding Examiner with minimum Numbers of Projects
        const examiners =await Users.aggregate([
            {$match:{
                $and:[
                    {"ugpc_details.committeeType":'Evaluation'},
                    {"ugpc_details.projects.project":{$ne:mongoose.Types.ObjectId(projectId)}},
                    {"_id":{$ne:mongoose.Types.ObjectId(supervisorId)}}
                    ]
            }},
            {
                $project:{
                    email:1,
                    name:1,
                    projectsCount:{
                        $cond: {
                            if: {
                                $isArray: "$ugpc_details.projects"
                            }, then: {
                                $size: "$ugpc_details.projects"
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

        //Choosing Examiner Randomly from minimum Numbers
        if (examiners.length === 0){
            await res.json({error:'Seems like no Examiner has been registered Yet!'});
            return;
        }else {
            const examiner = await _.sample(examiners[0].details);


            //Assigning ExternalExaminer-Updating Project
            const project =await Projects.findOneAndUpdate(projectId,
                {
                    "details.external.examiner":examiner._id
                },
                {new:true}
            ).populate('students','-_id name email student_details.regNo')
                .populate({path:'details.internal.examiner',model:'Users',select:'name ugpc_details.designation'})
                .populate({path:'details.external.examiner',model:'Users',select:'name ugpc_details.designation'})
                .select('students title details.supervisor');
            const studentEmails =await project.students.map(student => student.email);

            //Adding Project to Examiner Details
            const a = await Users.updateOne({_id:examiner._id},{
                $push:{
                    "ugpc_details.projects":{
                        project:projectId
                    }
                }
            });

            //Sending Emails

            const examinerEmailData = {
                from: "noreply@node-react.com",
                to: examiner.email,
                subject: "Project Assigned | External Evaluation",
                text: `Dear Examiner,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You for External Evaluation`,
                html: `
                <p>Dear Sir,</p>
                <p>We are pleased to inform you that you have been appointed as External examiner for the evaluation of the project submitted by,</p>
                 ${project.students.map((student,index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' :''}</b></p>`)}
                <p>The Title of Project is: ${title}</p>
                <br/>
                <p>It will be appreciated if you kindly fix a suitable date for the Viva-Voce Examination of the students.</p>
                <br/>
                <p>Regard!</p>
            `,
                attachments:[{filename:originalname,path:`${process.env.CLIENT_URL}/static/pdf/${filename}`}]
            };
            const studentsEmailData = {
                from: "noreply@node-react.com",
                to: studentEmails,
                subject: "External Assigned",
                text: `Dear Student,\n Name: ${examiner.name}\n email:${examiner.email}\n is assigned to your Project as an External Examiner`,
                html: `
                <p>Dear Student,</p>
                <p><b>Name: </b> ${examiner.name}</p>
                <p><b>Email: </b> ${examiner.email}</p>
                <p>is Assigned to your Project as an External Examiner. Venue and date will be specified by Your Examiner.</p>
                <br/>
                <p>Regard!</p>
            `
            };
            await sendEmail(examinerEmailData);
            await sendEmail(studentsEmailData);
            await res.json({success:'Assigned',examiner:project.details.external.examiner})
        }

    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.fetchExternalExaminers = async (req,res)=>{
    try {
        const {projectId,supervisorId} = req.body;
        //Finding Examiner with minimum Numbers of Projects
        const examiners =await Users.aggregate([
            {$match:{
                    $and:[
                        {"ugpc_details.committeeType":'Evaluation'},
                        {"ugpc_details.projects.project":{$ne:mongoose.Types.ObjectId(projectId)}},
                        {"_id":{$ne:mongoose.Types.ObjectId(supervisorId)}}
                    ]
                }},
            {
                $project:{
                    email:1,
                    name:1,
                    "ugpc_details.designation":1,
                    projectsCount:{
                        $cond: {
                            if: {
                                $isArray: "$ugpc_details.projects"
                            }, then: {
                                $size: "$ugpc_details.projects"
                            }, else: "0"
                        }}
                }
            },
            {$sort:{projectsCount: -1}}
        ]);
        await res.json(examiners)

    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.assignExternalManual = async (req,res)=>{
    try {
        const {projectId,originalname,filename,title,examinerId} = req.body;
        const examiner = await Users.findOne({"_id":examinerId})
            .select('name email -_id');
        //Assigning ExternalExaminer-Updating Project
        const project =await Projects.findOneAndUpdate(projectId,
            {
                "details.external.examiner":examinerId
            },
            {new:true}
        ).populate('students','-_id name email student_details.regNo')
            .populate({path:'details.internal.examiner',model:'Users',select:'name ugpc_details.designation'})
            .populate({path:'details.external.examiner',model:'Users',select:'name ugpc_details.designation'})
            .select('students title details.supervisor');
        const studentEmails =await project.students.map(student => student.email);

        //Adding Project to Examiner Details
        const a = await Users.updateOne({_id:examinerId},{
            $push:{
                "ugpc_details.projects":{
                    project:projectId
                }
            }
        });

        //Sending Emails

        const examinerEmailData = {
            from: "noreply@node-react.com",
            to: examiner.email,
            subject: "Project Assigned | External Evaluation",
            text: `Dear Examiner,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You for External Evaluation`,
            html: `
            <p>Dear Sir,</p>
            <p>We are pleased to inform you that you have been appointed as External examiner for the evaluation of the project submitted by,</p>
             ${project.students.map((student,index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' :''}</b></p>`)}
            <p>The Title of Project is: ${title}</p>
            <br/>
            <p>It will be appreciated if you kindly fix a suitable date for the Viva-Voce Examination of the students.</p>
            <br/>
            <p>Regard!</p>
        `,
            attachments:[{filename:originalname,path:`${process.env.CLIENT_URL}/static/pdf/${filename}`}]
        };
        const studentsEmailData = {
            from: "noreply@node-react.com",
            to: studentEmails,
            subject: "External Assigned",
            text: `Dear Student,\n Name: ${examiner.name}\n email:${examiner.email}\n is assigned to your Project as an External Examiner`,
            html: `
            <p>Dear Student,</p>
            <p><b>Name: </b> ${examiner.name}</p>
            <p><b>Email: </b> ${examiner.email}</p>
            <p>is Assigned to your Project as an External Examiner. Venue and date will be specified by Your Examiner.</p>
            <br/>
            <p>Regard!</p>
        `
        };
        await sendEmail(examinerEmailData);
        await sendEmail(studentsEmailData);
        await res.json({success:'Assigned',examiner:project.details.external.examiner})

    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.fetchAssignedForEvaluation = async (req,res) =>{
    try {
        const {userId} = req.params;
        const results = await Projects.aggregate([
            {
                $match:{$or:[{"details.internal.examiner":mongoose.Types.ObjectId(userId)},{"details.external.examiner":mongoose.Types.ObjectId(userId)}]}
            },
            {$unwind:"$documentation.visionDocument"},
            {$match:{
                    $or:[{"documentation.visionDocument.status":'Approved'},{"documentation.visionDocument.status":'Approved With Changes'}]
                }
            },
            {
                $project:{
                    "department":1,
                    "documentation.visionDocument.title":1,
                    "documentation.finalDocumentation":1,
                    "details.supervisor":1,
                    "details.internal":1,
                    "details.external":1,
                    "details.marks.internal":1,
                    "details.marks.external":1,
                    "students":1
                }
            },
            {$unwind:"$documentation.finalDocumentation"}

        ]);
        const projects = await Projects.populate(results,[
            {path:"details.supervisor",model:"Users",select:"name supervisor_details.position"},
            {path:"students",model:"Users",select:"name student_details.regNo"}
            ]);
        const marks = await Users.findOne({"role":"Chairman DCSSE"})
            .select('chairman_details.settings.marksDistribution.internal chairman_details.settings.marksDistribution.external -_id')
        await res.json({projects,marks:marks?marks.chairman_details.settings.marksDistribution: {proposal: 10,supervisor: 10,internal: 30,external: 50}})
    }
    catch (e) {
        await res.json({error:e.message})
    }
};

exports.evaluateInternalExternal = async (req,res) =>{
    try {
        const {projectId,marks,type} = req.body;
        const result = await Projects.updateOne({"_id":projectId},{
            [`details.marks.${type}`]:marks
        });
        await res.json({success:'Marks Added'})
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.fetchForApprovalLetter = async (req,res)=>{
    try {
        const result = await Projects.aggregate([
            {$unwind:"$documentation.visionDocument"},
            {$match:{
                    $or:[{"documentation.visionDocument.status":'Approved'},{"documentation.visionDocument.status":'Approved With Changes'}]
                }
            },
            {
                $project:{
                    "department":1,
                    "documentation.visionDocument.title":1,
                    "details.supervisor":1,
                    "details.acceptanceLetter":1,
                    "students":1
                }
            },
        ]);
        const projects = await Projects.populate(result,[
            {path:"details.supervisor",model:"Users",select:"name supervisor_details.position"},
            {path:"students",model:"Users",select:"name student_details.regNo student_details.batch"}
        ]);
        const chairman = await Users.findOne({role:'Chairman DCSSE'})
            .select('-_id name');
        await res.json({projects,chairman})
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.fetchForExternalLetter = async (req,res)=>{
    try {
        const result = await Projects.aggregate([
            {$unwind:"$documentation.visionDocument"},
            {$match:{
                    $or:[{"documentation.visionDocument.status":'Approved'},{"documentation.visionDocument.status":'Approved With Changes'}]
                }
            },
            {
                $project:{
                    "department":1,
                    "documentation.visionDocument.title":1,
                    "documentation.finalDocumentation":1,
                    "details.supervisor":1,
                    "details.internal":1,
                    "details.external":1,
                    "details.acceptanceLetter":1,
                    "students":1
                }
            },
            {$unwind:"$documentation.finalDocumentation"},
            {$match:{
                    "documentation.finalDocumentation.status":{$in:['Available for External','External Assigned','External Scheduled']}
                }
            },
            {
                $sort:{"details.external.date":1}
            }
        ]);
        const projects = await Projects.populate(result,[
            {path:"details.supervisor",model:"Users",select:"name supervisor_details.position"},
            {path:"details.internal.examiner",model:"Users",select:"name ugpc_details.designation"},
            {path:"details.external.examiner",model:"Users",select:"name ugpc_details.designation"},
            {path:"students",model:"Users",select:"name student_details.regNo student_details.batch"}
        ]);

        await res.json(projects)
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.fetchCompleted = async (req,res)=>{
    try {
        const result = await Projects.aggregate([
            {$unwind:"$documentation.visionDocument"},
            {$match:{
                    $or:[{"documentation.visionDocument.status":'Approved'},{"documentation.visionDocument.status":'Approved With Changes'}]
                }
            },
            {
                $project:{
                    "department":1,
                    "documentation.visionDocument.title":1,
                    "documentation.finalDocumentation":1,
                    "details.supervisor":1,
                    "details.internal":1,
                    "details.external":1,
                    "details.marks":1,
                    "details.acceptanceLetter":1,
                    "students":1
                }
            },
            {$unwind:"$documentation.finalDocumentation"},
            {$match:{
                    "documentation.finalDocumentation.status":'Completed'
                }
            }
        ]);
        const projects = await Projects.populate(result,[
            {path:"details.supervisor",model:"Users",select:"name supervisor_details.position"},
            {path:"details.internal.examiner",model:"Users",select:"name ugpc_details.designation"},
            {path:"details.external.examiner",model:"Users",select:"name ugpc_details.designation"},
            {path:"students",model:"Users",select:"name student_details.regNo student_details.batch"}
        ]);

        await res.json(projects)
    }catch (e) {
        await res.json({error:e.message})
    }
};