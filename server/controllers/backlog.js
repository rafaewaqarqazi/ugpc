const Projects = require('../models/projects');

const mongoose = require('mongoose');
const fs = require('fs');

exports.addNewTask = async (req, res) => {
  try {
    const {projectId, task} = req.body;
    const update = {
      ...task,
      createdAt: Date.now()
    };
    const result = await Projects.findByIdAndUpdate(projectId, {
      $addToSet: {
        "details.backlog": update
      }
    }, {new: true})
      .select('details.backlog')
      .populate({
        path: 'details.backlog.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
      .sort({"details.backlog.priority": 1});

    await res.json(result)
  } catch (e) {
    res.status(400).json(e.message)
  }
};

exports.planSprint = async (req, res) => {
  try {
    const {projectId, tasksIds, name, startDate, endDate} = req.body;
    const ids = tasksIds.map(id => mongoose.Types.ObjectId(id));
    const tasks = await Projects.aggregate([
      {
        $project: {"details.backlog": 1, _id: 0}
      },
      {
        $unwind: "$details.backlog"
      },
      {
        $match: {"details.backlog._id": {$in: ids}}
      }
    ]);
    const filteredTasks = await tasks.map(task => task.details.backlog);
    const result = await Projects.findOneAndUpdate(
      {"_id": projectId},
      {
        $pull: {
          "details.backlog": {
            "_id": {$in: tasksIds}
          }
        }
      },
      {multi: true}
    );
    const update = {
      "name": name,
      "startDate": startDate,
      "endDate": endDate,
      "status": 'InComplete',
      "tasks": await filteredTasks
    };
    const updatedResult = await Projects.findByIdAndUpdate(projectId,
      {
        $addToSet: {
          "details.sprint": update
        }
      }, {new: true})
      .select('details.backlog')
      .populate({
        path: 'details.backlog.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
      .sort({"details.backlog.priority": 1});
    await res.json(updatedResult)
  } catch (e) {
    await res.json(e.message)
  }

}

exports.changeTaskStatus = async (req, res) => {
  try {
    const {projectId, taskId, newColumn, sprintId} = req.body;

    //Adding Task to New Column

    const updatedResult = await Projects.findOneAndUpdate(
      {"_id": projectId},
      {
        $set: {
          "details.sprint.$[spr].tasks.$[tsk].status": newColumn === 'todos' ? 'todo' : newColumn
        }
      },
      {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}],
        new: true
      })
      .populate({
        path: 'details.sprint.tasks.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});
    await res.json(updatedResult)
  } catch (e) {
    await res.json(e.message)
  }

};

exports.changeTaskPriority = async (req, res) => {
  try {
    const {projectId, taskId, priority} = req.body;

    const updatedResult = await Projects.findOneAndUpdate(
      {"_id": projectId, "details.backlog._id": taskId},
      {
        $set: {
          "details.backlog.$.priority": priority
        }
      }, {new: true})
      .select('details.backlog details.sprint')
      .populate({
        path: 'details.backlog.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
      .sort({"details.backlog.priority": 1})
    await res.json(updatedResult)
  } catch (e) {
    await res.json(e.message)
  }
};

exports.completeSprint = async (req, res) => {

  try {
    const {tasks, projectId, sprintId} = req.body;

    const result = await Projects.findOneAndUpdate(
      {"_id": projectId, "details.sprint._id": sprintId},
      {
        $push: {
          "details.backlog": tasks
        },
        $set: {
          "details.sprint.$.status": "Completed",
          "details.sprint.$.completedOn": Date.now()
        }
      }, {new: true})
      .select('details.sprint')
      .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({
        path: 'details.sprint.tasks.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});
    await res.json(result)
  } catch (e) {
    await res.json(e.message)
  }

};

exports.removeTask = async (req, res) => {
  try {
    const {projectId, taskId} = req.body;
    const result = await Projects.findByIdAndUpdate(projectId, {
      $pull: {
        "details.backlog": {
          _id: mongoose.Types.ObjectId(taskId)
        }
      }
    }, {new: true})
      .select('details.backlog')
      .populate({
        path: 'details.backlog.assignee',
        model: 'Users',
        select: 'name department student_details email profileImage'
      })
      .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
      .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
      .sort({"details.backlog.priority": 1});

    await res.json(result);
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.addAttachmentsToTask = async (req, res) => {
  try {
    const {projectId, taskId, taskIn, sprintId} = req.body;
    let files = [];
    req.files.map(file => {
      files = [...files, {
        filename: file.filename,
        originalname: file.originalname
      }]
    });

    if (taskIn === 'Backlog') {
      const result = await Projects.findOneAndUpdate({
        "_id": projectId,
        "details.backlog._id": mongoose.Types.ObjectId(taskId)
      }, {
        $push: {
          "details.backlog.$.attachments": {
            $each: files
          }
        }
      }, {new: true})
        .select('details.backlog')
        .populate({
          path: 'details.backlog.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
        .sort({"details.backlog.priority": 1});

      await res.json({result, files})
    } else if (taskIn === 'ScrumBoard') {
      const result = await Projects.findOneAndUpdate({"_id": projectId}, {
        $push: {
          "details.sprint.$[spr].tasks.$[tsk].attachments": {
            $each: files
          }
        }
      }, {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}],
        new: true
      })
        .select('details.sprint')
        .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({
          path: 'details.sprint.tasks.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});

      await res.json({result, files})
    }


  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.removeAttachmentFromTask = (req, res) => {
  const {projectId, taskId, filename, taskIn, sprintId} = req.body;
  fs.unlink(`public/static/images/${filename}`, err => {
    if (err) {
      res.json({error: err.message})
    }

    if (taskIn === 'Backlog') {
      Projects.findOneAndUpdate({"_id": projectId, "details.backlog._id": mongoose.Types.ObjectId(taskId)}, {
        $pull: {
          "details.backlog.$.attachments": {
            filename: filename
          }
        }
      }, {new: true})
        .select('details.backlog')
        .populate({
          path: 'details.backlog.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
        .sort({"details.backlog.priority": 1})
        .then(result => {
          res.json(result)
        })
        .catch(error => {
          res.json({error: error.message})
        });
    } else if (taskIn === 'ScrumBoard') {
      Projects.findOneAndUpdate({"_id": projectId}, {
        $pull: {
          "details.sprint.$[spr].tasks.$[tsk].attachments": {
            filename: filename
          }
        }
      }, {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}],
        new: true
      })
        .select('details.sprint')
        .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({
          path: 'details.sprint.tasks.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'})
        .then(result => {
          res.json(result)
        })
        .catch(error => {
          res.json({error: error.message})
        });
    }


  });
};

exports.addCommentToTask = async (req, res) => {
  try {
    const {projectId, taskId, taskIn, sprintId, author, text} = req.body;

    if (taskIn === 'Backlog') {
      const result = await Projects.findOneAndUpdate({
        "_id": projectId,
        "details.backlog._id": mongoose.Types.ObjectId(taskId)
      }, {
        $push: {
          "details.backlog.$.discussion": {
            text,
            author,
            createdAt: Date.now()
          }
        }
      }, {new: true})
        .select('details.backlog')
        .populate({
          path: 'details.backlog.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
        .sort({"details.backlog.priority": 1});

      await res.json(result)
    } else if (taskIn === 'ScrumBoard') {
      const result = await Projects.findOneAndUpdate({"_id": projectId}, {
        $push: {
          "details.sprint.$[spr].tasks.$[tsk].discussion": {
            text,
            author,
            createdAt: Date.now()
          }
        }
      }, {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}],
        new: true
      })
        .select('details.sprint')
        .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({
          path: 'details.sprint.tasks.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});
      await res.json(result)
    }


  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.changeTaskComment = async (req, res) => {
  try {
    const {projectId, taskId, taskIn, sprintId, text, commentId} = req.body;

    if (taskIn === 'Backlog') {
      const result = await Projects.findOneAndUpdate({
        "_id": projectId
      }, {
        $set: {
          "details.backlog.$[backlog].discussion.$[disc].text": text
        }
      }, {
        arrayFilters: [{"backlog._id": mongoose.Types.ObjectId(taskId)}, {"disc._id": mongoose.Types.ObjectId(commentId)}],
        new: true
      })
        .select('details.backlog')
        .populate({
          path: 'details.backlog.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
        .sort({"details.backlog.priority": 1});

      await res.json(result)
    } else if (taskIn === 'ScrumBoard') {
      const result = await Projects.findOneAndUpdate({"_id": projectId}, {
        $set: {
          "details.sprint.$[spr].tasks.$[tsk].discussion.$[disc].text": text
        }
      }, {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}, {"disc._id": mongoose.Types.ObjectId(commentId)}],
        new: true
      })
        .select('details.sprint')
        .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({
          path: 'details.sprint.tasks.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});
      await res.json(result)
    }


  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.removeTaskComment = async (req, res) => {
  try {
    const {projectId, taskId, taskIn, sprintId, commentId} = req.body;

    if (taskIn === 'Backlog') {
      const result = await Projects.findOneAndUpdate({
        "_id": projectId,
        "details.backlog._id": mongoose.Types.ObjectId(taskId)
      }, {
        $pull: {
          "details.backlog.$.discussion": {
            "_id":mongoose.Types.ObjectId(commentId)
          }
        }
      }, {new: true})
        .select('details.backlog')
        .populate({
          path: 'details.backlog.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({path: 'details.backlog.createdBy', model: 'Users', select: 'name role'})
        .sort({"details.backlog.priority": 1});

      await res.json(result)
    } else if (taskIn === 'ScrumBoard') {
      const result = await Projects.findOneAndUpdate({"_id": projectId}, {
        $pull: {
          "details.sprint.$[spr].tasks.$[tsk].discussion": {
            "_id": mongoose.Types.ObjectId(commentId)
          }
        }
      }, {
        arrayFilters: [{"spr._id": mongoose.Types.ObjectId(sprintId)}, {"tsk._id": mongoose.Types.ObjectId(taskId)}],
        new: true
      })
        .select('details.sprint')
        .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
        .populate({
          path: 'details.sprint.tasks.assignee',
          model: 'Users',
          select: 'name department student_details email profileImage'
        })
        .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'});
      await res.json(result)
    }


  } catch (e) {
    await res.json({error: e.message})
  }
};