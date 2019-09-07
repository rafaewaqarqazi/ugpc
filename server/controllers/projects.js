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
        .populate('details.supervisor','_id name supervisor_details.position')
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