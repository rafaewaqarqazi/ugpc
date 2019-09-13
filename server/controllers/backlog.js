const Projects = require('../models/projects');
const Users = require('../models/users');
const mongoose = require('mongoose')
const {sendEmail} = require("../helpers");
const moment = require('moment');
const _ = require('lodash');

exports.addNewTask = async (req,res)=>{
    try {
        const {projectId,task} = req.body;
        const update={
            ...task,
            createdAt:Date.now()
        }
        const result = await Projects.findByIdAndUpdate(projectId,{
            $push:{
                "details.backlog":update
            }
        },{new:true})
            .select('details.backlog')
            .populate('details.backlog.assignee','name department student_details email')
            .sort({"details.backlog.priority":1})

        await res.json(result)
    }
    catch (e) {
        res.status(400).json(e.message)
    }



}