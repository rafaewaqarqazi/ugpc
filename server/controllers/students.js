const Users = require('../models/users');
require('dotenv').config();
const Projects = require('../models/projects');
const {sendEmail} = require("../helpers");

exports.changeEligibility = (req, res)=>{
    Users.findOneAndUpdate({_id:req.params.userId},
        {"student_details.isEligible":req.body.status}
        )
        .then(user => {
            const emailText = req.body.status === 'Eligible'?
                `Dear Student,/nYou are Eligible for FYP, please click on the following link to start your Project./n${
                    process.env.CLIENT_URL
                }/student/project/create`
                :
                'Dear Student,/n You are NOT ELIGIBLE for FYP YET. For further details please visit program office';
            const emailHtml =req.body.status === 'Eligible'?
                `
                    <p>Dear Student,</p>
                    <p>You are Eligible for FYP, please click on the following link to start your Project.</p>
                    <p>${process.env.CLIENT_URL}/student/project/create</p>
                `:
                `
                <p>Dear Student,</p>
                    <p>You are <b>NOT ELIGIBLE</b> for FYP YET. For further details please visit program office</p>
                `;

            const emailData = {
                from: "noreply@node-react.com",
                to: user.email,
                subject: "Eligibility Status Update | Program Office",
                text: emailText,
                html: emailHtml
            };

            sendEmail(emailData);
            res.json({message:'Success'})
        })
        .catch(err => {
            res.status(400).json({error:err})
        })
};

exports.uploadVisionDocument = (req, res) => {
       const update = {
           $push:{
               "documentation.visionDocument":{
                           "title":req.body.title,
                           "abstract":req.body.abstract,
                           "scope":req.body.scope,
                           "majorModules":JSON.parse(req.body.majorModules),
                            "status":'Waiting for Initial Approval',
                            "uploadedAt":Date.now(),
                            "documents":[{
                                "originalname":req.file.originalname,
                                "filename":req.file.filename,
                                "type":req.file.mimetype,
                            }]

              }
           }
       };

        Projects.findByIdAndUpdate(req.params.id,update)
        .then(project =>{
            res.json({message: "Vision Document Uploaded"});
        })
            .catch(err => console.log(err.message));


};

exports.uploadFinalDocumentation =  (req,res)=>{

    const update = {
        $push:{
            "documentation.finalDocumentation":{
                "status":'Waiting for Approval',
                "uploadedAt":Date.now(),
                "document":{
                    "originalname":req.file.originalname,
                    "filename":req.file.filename,
                    "type":req.file.mimetype,
                }
            }
        },
        $set:{
            "details.marks.supervisor":undefined
        }
    };

    Projects.findByIdAndUpdate(req.body.projectId,update,{new:true})
        .select('documentation.finalDocumentation')
    .populate('details.supervisor','email')
        .populate('students','name student_details.regNo')
        .then(project =>{
            const emailData = {
                from: "noreply@node-react.com",
                to: project.details.supervisor.email,
                subject: "Final Documentation Upload | Review",
                text: `Dear Supervisor,\n ${project.students[0].name}, ${project.students[0].student_details.regNo} has uploaded his Project's Final Documentation,\n Please Review it for further actions`,
                html:  `
                    <p>Dear Supervisor,</p>
                    <p>Name: ${project.students[0].name}</p>
                    <p>Reg No: ${project.students[0].student_details.regNo}</p>
                    <p>has uploaded his Project's Final Documentation, Please review it for further actions</p>
                    <br/>
                    <p>Regards,</p>
                `,
                attachments:[{filename:req.file.originalname,path:`${process.env.CLIENT_URL}/static/pdf/${req.file.filename}`}]
            };

            sendEmail(emailData);
            res.json(project);
        })
        .catch(err => console.log(err.message));


}
exports.getNotEnrolledStudents =async (req, res)=>{
   const projects = await Projects.aggregate([
        {
            $unwind: '$students'
        },
        {
            $group:{_id:'$students'}
        }
    ]).exec();
    let s =[];
    projects.map((project,i) =>{
        s[i]=project._id
    });
   const ids = [
        ...s,
        req.params.userId
    ];
    const users = await Users.where('role').equals('Student')
        .where({"student_details.isEligible": "Eligible"})
        .where({"student_details.department": req.profile.student_details.department})
        .where('_id').nin(ids)
        .select('_id name email role student_details');
    await res.json(users)
};
exports.fetchForProgramOffice =async (req, res)=>{
    try {
        const students = await Users.find({
            $and:
                [
                    {role:'Student'},
                    {
                        $or:[
                            {"student_details.isEligible":'Pending'},
                            {"student_details.isEligible":'Not Eligible'}
                            ]
                    }
                ]
        }).select('_id name email student_details department');

        await res.json(students)
    }catch (e) {
        res.status(400).json(e.message)
    }
};

exports.resubmitVisionDoc =async (req,res)=>{
    try {
        const {projectId,documentId} = req.body;
        console.log('File',req.file);

        const result = await Projects.updateOne(
            {"_id":projectId, "documentation.visionDocument._id":documentId},
            {
                $push:{
                    "documentation.visionDocument.$.documents":{
                        "originalname":req.file.originalname,
                        "filename":req.file.filename,
                        "type":req.file.mimetype
                    }
                }
            }
        )

        await res.json({
            originalname:req.file.originalname,
            filename:req.file.filename,
            type:req.file.mimetype
        })
    }catch (e) {
        await res.json({error:e.message})
    }


}