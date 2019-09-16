const Projects = require('../models/projects');

const mongoose = require('mongoose');

const moment = require('moment');


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
            .select('details.backlog details.sprint')
            .populate('details.backlog.assignee','name department student_details email')
            .populate('details.backlog.createdBy','name')
            .populate('details.sprint.todos.assignee','name department student_details email')
            .populate('details.sprint.todos.createdBy','name')
            .populate('details.sprint.inProgess.assignee','name department student_details email')
            .populate('details.sprint.inProgess.createdBy','name')
            .populate('details.sprint.inReview.assignee','name department student_details email')
            .populate('details.sprint.inReview.createdBy','name')
            .populate('details.sprint.done.assignee','name department student_details email')
            .populate('details.sprint.done.createdBy','name')
            .sort({"details.backlog.priority":1})

        await res.json(result)
    }
    catch (e) {
        res.status(400).json(e.message)
    }
};

exports.planSprint = async (req,res)=>{
    try {
        const {projectId,tasksIds,name,startDate,endDate} = req.body;
        const ids = tasksIds.map(id => mongoose.Types.ObjectId(id));
        const tasks = await Projects.aggregate([
            {
                $project:{"details.backlog":1,_id:0}
            },
            {
                $unwind:"$details.backlog"
            },
            {
                $match:{"details.backlog._id":{$in:ids}}
            }
        ])
        const filteredTasks = await tasks.map(task => task.details.backlog)
        const result = await Projects.findOneAndUpdate(
            {"_id":projectId},
            {
                $pull:{
                    "details.backlog":{
                        "_id":{$in:tasksIds}
                    }
                }
            },
            {multi:true}
        );
        const update = {
            "name":name,
            "startDate":startDate,
            "endDate":endDate,
            "todos":await filteredTasks
        };
        console.log(update)
        const updatedResult = await Projects.findByIdAndUpdate(projectId,
            {
                $push: {
                    "details.sprint": update
                }
            },{new:true})
            .select('details.backlog details.sprint')
            .populate('details.backlog.assignee','name department student_details email')
            .populate('details.backlog.createdBy','name')
            .populate('details.sprint.todos.assignee','name department student_details email')
            .populate('details.sprint.todos.createdBy','name')
            .populate('details.sprint.inProgess.assignee','name department student_details email')
            .populate('details.sprint.inProgess.createdBy','name')
            .populate('details.sprint.inReview.assignee','name department student_details email')
            .populate('details.sprint.inReview.createdBy','name')
            .populate('details.sprint.done.assignee','name department student_details email')
            .populate('details.sprint.done.createdBy','name')
            .sort({"details.backlog.priority":1})
       await res.json(updatedResult)
    }catch (e) {
        await res.json(e.message)
    }

}

exports.changeTaskStatus = async (req,res)=>{
    try {
        const {projectId,taskId,existingColumn,newColumn,task,sprintId} = req.body;
        const assignee = task.assignee.map(a => mongoose.Types.ObjectId(a._id));
        const createdBy = mongoose.Types.ObjectId(task.createdBy._id)
        const updatedTask = {
            ...task,
            _id:mongoose.Types.ObjectId(taskId),
            assignee:assignee,
            createdBy:createdBy
        }
        //Removing Task from Existing Column
        const result = await Projects.updateOne(
            {"_id":projectId,"details.sprint._id":sprintId},
            {

                    $pull:{
                        [`details.sprint.$[].${existingColumn}`]:{
                            _id:mongoose.Types.ObjectId(taskId)
                        }
                    }

            },
        );

        //Adding Task to New Column

        const updatedResult = await Projects.findOneAndUpdate(
            {"_id":projectId,"details.sprint._id":sprintId},
            {
                $push: {
                    [`details.sprint.$.${newColumn}`]:updatedTask
                }
            },{new:true})
            .select('details.backlog details.sprint')
            .populate('details.backlog.assignee','name department student_details email')
            .populate('details.backlog.createdBy','name')
            .populate({path:'details.sprint.todos.assignee',model:'Users',select:'name department student_details email'})
            .populate({path:'details.sprint.todos.createdBy',model:'Users',select:'name'})
            .populate({path:'details.sprint.inProgress.assignee',model:'Users',select:'name department student_details email'})
            .populate({path:'details.sprint.inProgress.createdBy',model:'Users',select:'name'})
            .populate({path:'details.sprint.inReview.assignee',model:'Users',select:'name department student_details email'})
            .populate({path:'details.sprint.inReview.createdBy',model:'Users',select:'name'})
            .populate({path:'details.sprint.done.assignee',model:'Users',select:'name department student_details email'})
            .populate({path:'details.sprint.done.createdBy',model:'Users',select:'name'})
            .sort({"details.backlog.priority":1})
        await res.json(updatedResult)
    }catch (e) {
        await res.json(e.message)
    }

}