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
        const {projectId,title} = req.body;
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
        const supervisor = await _.sample(supervisors[0].details);

        //Assigning Supervisor-Updating Project
        const project =await Projects.findOneAndUpdate(projectId,
            {"details.supervisor":supervisor._id},
            {new:true}
            ).populate('students','-_id email student_details.regNo')
            .populate({path:'details.supervisor',model:'Users',select:'name supervisor_details.position'})
            .select('students title details.supervisor');
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
}