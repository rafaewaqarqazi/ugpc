const Projects = require('../models/projects');
const Users = require('../models/users');
const mongoose = require('mongoose');
const {sendEmail} = require("../helpers");
const moment = require('moment');
const _ = require('lodash');

exports.getAllProjects = (req, res) => {
  Projects.aggregate([
    {$unwind: "$documentation.visionDocument"},
    {
      $match: {$or: [{"documentation.visionDocument.status": "Approved"}, {"documentation.visionDocument.status": "Approved With Changes"}]}
    },
    {
      $project: {
        "documentation.visionDocument.title": 1,
        "details.backlog": 1,
        "details.sprint": 1,
        "details.acceptanceLetter.issueDate": 1,
        "details.estimatedDeadline": 1
      }
    }
  ])
    .then(projects => {
      res.json(projects);
    })
    .catch(err => res.status(400).json({error: err}))
};
exports.findByStudentId = (req, res, next, id) => {

  Projects.find({students: id})
    .populate('students', '_id name department student_details profileImage')
    .populate('documentation.visionDocument.comments.author', '_id name role department profileImage')
    .populate('details.supervisor', '_id name email supervisor_details.position profileImage')
    .populate('details.backlog.assignee', '_id name department student_details profileImage')
    .populate('details.backlog.createdBy', 'name role')
    .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
    .populate({
      path: 'details.sprint.tasks.assignee',
      model: 'Users',
      select: 'name department student_details email profileImage'
    })
    .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
    .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'})
    .then(project => {
      req.project = project[0];
      next()
    })
    .catch(err => {
      res.status(400).json({error: err});
      next();
    })
};
exports.findByProjectId = (req, res, next, id) => {

  Projects.findById(id)
    .populate('students', '_id name department student_details profileImage')
    .populate('documentation.visionDocument.comments.author', '_id name role department profileImage')
    .populate('details.supervisor', '_id name supervisor_details.position profileImage')
    .populate('details.backlog.assignee', '_id name department student_details profileImage')
    .populate('details.backlog.createdBy', 'name role')
    .populate({path: 'details.backlog.discussion.author', model: 'Users', select: 'name profileImage'})
    .populate({
      path: 'details.sprint.tasks.assignee',
      model: 'Users',
      select: 'name department student_details email profileImage'
    })
    .populate({path: 'details.sprint.tasks.discussion.author', model: 'Users', select: 'name profileImage'})
    .populate({path: 'details.sprint.tasks.createdBy', model: 'Users', select: 'name role'})
    .then(project => {
      req.project = project;
      next()
    })
    .catch(err => {
      res.status(400).json({error: err});
      next();
    })
};
exports.createProject = (req, res) => {

  const project = new Projects(req.body);
  project.save()
    .then(data => res.json(data))
    .catch(err => res.json({error: err}))
};
exports.fetchSupervisors = async (req, res) => {
  try {
    const supervisors = await Users.aggregate([
      {$match: {"role": 'Supervisor'}},
      {
        $project: {
          email: 1,
          name: 1,
          "ugpc_details.designation": 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$supervisor_details.projects"
              }, then: {
                $size: "$supervisor_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}}
    ]);
    await res.json(supervisors)
  } catch (e) {
    await res.json({error: e.message})
  }
}

exports.assignSupervisorAuto = async (req, res) => {
  try {
    const {projectId, title, regNo, filename} = req.body;
    //Finding Supervisor with minimum Numbers of Projects
    const supervisors = await Users.aggregate([
      {$match: {"role": 'Supervisor'}},
      {
        $project: {
          email: 1,
          name: 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$supervisor_details.projects"
              }, then: {
                $size: "$supervisor_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}},
      {
        $group: {
          "_id": "$projectsCount",
          details: {$push: "$$ROOT"},
        }
      },
    ]);
    console.log('supervisors', supervisors)
    //Choosing Supervisor Randomly from minimum Numbers
    if (supervisors.length === 0) {
      return await res.json({error: 'Seems like no Supervisor has been registered Yet!'})
    }
    const supervisor = await _.sample(supervisors[0].details);
    const date = Date.now();
    const estimatedDeadline = moment(date).add(4, 'M').add(1, 'd').startOf('d');
    //Assigning Supervisor-Updating Project
    const result = await Projects.updateOne({_id: projectId},
      {
        $set: {
          "details.supervisor": supervisor._id,
          "details.acceptanceLetter": {
            name: `${regNo}.pdf`,
            issueDate: date
          },
          "details.estimatedDeadline": estimatedDeadline
        }
      });
    const project = await Projects.findOne({_id: projectId}).populate('students', '-_id email student_details.regNo')
      .select('students title details.supervisor details.acceptanceLetter')
      .populate({path: 'details.supervisor', model: 'Users', select: 'name supervisor_details.position'});

    const studentEmails = await project.students.map(student => student.email);

    //Adding Project to Supervisor Details
    const a = await Users.updateOne({_id: supervisor._id}, {
      $addToSet: {
        "supervisor_details.projects": {
          project: projectId,
          title
        }
      }
    });

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
            `,
      attachments: [{filename, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
                   <p>Regards!</p>
            `
    };
    sendEmail(supervisorEmailData);
    sendEmail(studentsEmailData);
    await res.json({
      success: 'Assigned',
      supervisor: project.details.supervisor,
      acceptanceLetter: project.details.acceptanceLetter
    })
  } catch (e) {
    await res.json({error: e.message})
  }

};
exports.assignSupervisorManual = async (req, res) => {
  try {
    const {projectId, title, regNo, filename, supervisorId} = req.body;
    const date = Date.now();
    const estimatedDeadline = moment(date).add(4, 'M').add(1, 'd').startOf('d');
    //Assigning Supervisor-Updating Project
    const result = await Projects.updateOne({_id: projectId},
      {
        $set: {
          "details.supervisor": mongoose.Types.ObjectId(supervisorId),
          "details.acceptanceLetter": {
            name: `${regNo}.pdf`,
            issueDate: date
          },
          "details.estimatedDeadline": estimatedDeadline
        }
      });
    const project = await Projects.findOne({_id: projectId}).populate('students', '-_id email student_details.regNo')
      .select('students title details.supervisor details.acceptanceLetter')
      .populate({path: 'details.supervisor', model: 'Users', select: 'name supervisor_details.position'});

    const studentEmails = await project.students.map(student => student.email);

    //Adding Project to Supervisor Details
    const exists = await Users.findOne({
      _id: mongoose.Types.ObjectId(supervisorId),
      "supervisor_details.projects.project": projectId
    })
    console.log('exists', exists)
    if (!exists) {
      const supervisor = await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(supervisorId)}, {
        $addToSet: {
          "supervisor_details.projects": {
            project: projectId,
            title
          }
        }
      })
        .select('name email');

      //Sending Emails
      console.log('supervisor', supervisor)
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
            `,
        attachments: [{filename, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
                   <p>Regards!</p>
            `
      };
      sendEmail(supervisorEmailData);
      sendEmail(studentsEmailData);
      return res.json({
        success: 'Assigned',
        supervisor: project.details.supervisor,
        acceptanceLetter: project.details.acceptanceLetter
      })
    } else {
      return res.json({
        error: 'Something went wrong'
      })
    }

  } catch (e) {
    await res.json({error: e.message})
  }

};


exports.fetchFinalDocumentationsBySupervisor = async (req, res) => {
  try {
    const {supervisorId} = req.params;
    const result = await Projects.find({"details.supervisor": supervisorId})
      .select('documentation.finalDocumentation documentation.visionDocument.title documentation.visionDocument.status students details.estimatedDeadline department details.marks.supervisor')
      .populate('students', 'name student_details');
    await res.json(result)
  } catch (e) {
    await res.json(e.message)
  }
};

exports.changeFDStatus = async (req, res) => {
  try {
    const {status, projectId, documentId, comment} = req.body;
    const result = await Projects.findOneAndUpdate({
        "_id": projectId,
        "documentation.finalDocumentation._id": documentId
      },
      {
        $set: {
          "documentation.finalDocumentation.$.status": status,
        }
      })
      .select('students')
      .populate('students', 'email')
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
                ${comment !== undefined ? `<p><b>Reason:</b> ${comment}</p>` : ''}
                <br/>
                <p>Learn About Evaluation Statuses:</p>
                <p><b>NotApproved:</b> Your Documentation is rejected by supervisor or it needs changes.</p>
                <p><b>ReSubmit:</b> Your Documentation is rejected by examiner or it needs changes.</p>
                <p><b>Approved:</b> Your Documentation is accepted by supervisor.</p>
                <p><b>Available for Internal:</b> Your Project is sent to evaluation Committee for internal scheduling.</p>
                <p><b>Internal Scheduled:</b> Your Project's internal is scheduled.</p>
                <p><b>Available for external:</b> Your Project is send to evaluation committee for external scheduling.</p>
                <p><b>Completed:</b> Your Evaluation Process is Completed.</p>
                <p>Regards!</p>
            `
    };
    sendEmail(studentEmailData);
    await res.json({message: 'Success'})
  } catch (e) {
    await res.json(e.message)
  }
};

exports.fetchForEvaluation = async (req, res) => {
  try {
    const {committees} = req.query;
    const dep = committees.split(',');
    const result = await Projects.aggregate([
      {$match: {"department": {$in: dep}}},
      {$unwind: "$documentation.visionDocument"},
      {
        $match: {
          $or: [{"documentation.visionDocument.status": 'Approved'}, {"documentation.visionDocument.status": 'Approved With Changes'}]
        }
      },
      {
        $project: {
          "department": 1,
          "documentation.visionDocument.title": 1,
          "documentation.finalDocumentation": 1,
          "details.marks": 1,
          "details.internal": 1,
          "details.external": 1,
          "details.supervisor": 1
        }
      },
      {$unwind: "$documentation.finalDocumentation"},
      {
        $match: {
          "documentation.finalDocumentation.status": {$nin: ['Waiting for Approval', 'Approved']}
        }
      }
    ]);
    const projects = await Projects.populate(result, [
      {path: "details.supervisor", model: 'Users', select: "name supervisor_details.position"},
      {path: "details.internal.examiner", model: 'Users', select: "name ugpc_details"},
      {path: "details.external.examiner", model: 'Users', select: "name ugpc_details"},
    ]);
    await res.json(projects)
  } catch (e) {
    await res.json(e.message)
  }
};

exports.scheduleInternalAuto = async (req, res) => {
  try {
    const {venue, selectedDate, projectId, originalname, filename, title, supervisorId} = req.body;
    //Finding Examiner with minimum Numbers of Projects
    const examiners = await Users.aggregate([
      {
        $match: {
          $and: [
            {"ugpc_details.committeeType": 'Evaluation'},
            {
              "_id": {$ne: mongoose.Types.ObjectId(supervisorId)}
            }]
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$ugpc_details.projects"
              }, then: {
                $size: "$ugpc_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}},
      {
        $group: {
          "_id": "$projectsCount",
          details: {$push: "$$ROOT"},
        }
      },
    ]);

    //Choosing Examiner Randomly from minimum Numbers
    if (examiners.length === 0) {
      return await res.json({error: 'Seems like no Examiner has been registered Yet!'})
    }
    const examiner = await _.sample(examiners[0].details);

    //Assigning Supervisor-Updating Project
    const project = await Projects.findOneAndUpdate({_id: mongoose.Types.ObjectId(projectId)},
      {
        "details.internal.examiner": examiner._id,
        "details.internal.date": selectedDate,
        "details.internal.venue": venue
      },
      {new: true}
    ).populate('students', '-_id name email student_details.regNo')
      .populate({path: 'details.internal.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .populate({path: 'details.external.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .select('students title details.supervisor');
    const studentEmails = await project.students.map(student => student.email);

    //Adding Project to Examiner Details
    const a = await Users.updateOne({_id: examiner._id}, {
      $push: {
        "ugpc_details.projects": {
          project: projectId
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
                 ${project.students.map((student, index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' : ''}</b></p>`)}
                <p>The Title of Project is: ${title}</p>
                <br/>
                <p> Venue and Date is given below.</p>
                <p><b>Venue: </b>${venue}</p>
                <p><b>Date: </b> ${moment(selectedDate).format('MMM DD, YYYY')}</p>
                <br/>
                <p>Regards!</p>
            `,
      attachments: [{filename: originalname, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
                <p>Regards!</p>
            `
    };
    sendEmail(examinerEmailData);
    sendEmail(studentsEmailData);
    await res.json({success: 'Assigned', examiner: project.details.internal.examiner})
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.scheduleInternalManual = async (req, res) => {
  try {
    const {venue, selectedDate, projectId, originalname, filename, title, examinerId} = req.body;
    //Assigning Examiner-Updating Project
    const project = await Projects.findOneAndUpdate({_id: mongoose.Types.ObjectId(projectId)},
      {
        "details.internal.examiner": examinerId,
        "details.internal.date": selectedDate,
        "details.internal.venue": venue
      },
      {new: true}
    ).populate('students', '-_id name email student_details.regNo')
      .populate({path: 'details.internal.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .populate({path: 'details.external.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .select('students title details.supervisor');
    const studentEmails = await project.students.map(student => student.email);

    //Adding Project to Examiner Details
    const examiner = await Users.findOneAndUpdate({_id: examinerId}, {
      $push: {
        "ugpc_details.projects": {
          project: projectId
        }
      }
    }).select('name email');

    //Sending Emails

    const examinerEmailData = {
      from: "noreply@node-react.com",
      to: examiner.email,
      subject: "Project Assigned | Internal Evaluation",
      text: `Dear Examiner,\nProject named as ${title} And students with Registration Numbers: ${project.students.map(student => student.student_details.regNo)}, is assign to You for Internal Evaluation`,
      html: `
                <p>Dear Sir,</p>
                <p>We are pleased to inform you that you have been appointed as Internal examiner for the evaluation of the project submitted by,</p>
                 ${project.students.map((student, index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' : ''}</b></p>`)}
                <p>The Title of Project is: ${title}</p>
                <br/>
                <p> Venue and Date is given below.</p>
                <p><b>Venue: </b>${venue}</p>
                <p><b>Date: </b> ${moment(selectedDate).format('MMM DD, YYYY')}</p>
                <br/>
                <p>Regards!</p>
            `,
      attachments: [{filename: originalname, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
                <p>Regards!</p>
            `
    };
    sendEmail(examinerEmailData);
    sendEmail(studentsEmailData);
    await res.json({success: 'Assigned', examiner: project.details.internal.examiner})
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.fetchInternalExaminers = async (req, res) => {
  try {
    const {supervisorId} = req.query;
    //Finding Examiner with minimum Numbers of Projects
    const examiners = await Users.aggregate([
      {
        $match: {
          $and: [
            {"ugpc_details.committeeType": 'Evaluation'},
            {
              "_id": {$ne: mongoose.Types.ObjectId(supervisorId)}
            }]
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          "ugpc_details.designation": 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$ugpc_details.projects"
              }, then: {
                $size: "$ugpc_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}}
    ]);

    await res.json(examiners)
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.scheduleExternalDate = async (req, res) => {
  try {
    const {venue, selectedDate, projectId} = req.body;

    //Assigning ExternalDate Project
    const project = await Projects.findOneAndUpdate({_id: mongoose.Types.ObjectId(projectId)},
      {
        "details.external.date": selectedDate,
        "details.external.venue": venue
      },
      {new: true}
    ).populate('students', '-_id email student_details.regNo')
      .populate({path: 'details.internal.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .populate({path: 'details.external.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .select('students title details.supervisor');
    const studentEmails = await project.students.map(student => student.email);


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
                <p>Regards!</p>
            `
    };
    sendEmail(studentsEmailData);
    await res.json({success: 'Scheduled'})
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.assignExternalAuto = async (req, res) => {
  try {
    const {projectId, originalname, filename, title, supervisorId} = req.body;
    //Finding Examiner with minimum Numbers of Projects
    const examiners = await Users.aggregate([
      {
        $match: {
          $and: [
            {"ugpc_details.committeeType": 'Evaluation'},
            {"ugpc_details.projects.project": {$ne: mongoose.Types.ObjectId(projectId)}},
            {"_id": {$ne: mongoose.Types.ObjectId(supervisorId)}}
          ]
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$ugpc_details.projects"
              }, then: {
                $size: "$ugpc_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}},
      {
        $group: {
          "_id": "$projectsCount",
          details: {$push: "$$ROOT"},
        }
      },
    ]);

    //Choosing Examiner Randomly from minimum Numbers
    if (examiners.length === 0) {
      await res.json({error: 'Seems like no Examiner has been registered Yet!'});
      return;
    } else {
      const examiner = await _.sample(examiners[0].details);


      //Assigning ExternalExaminer-Updating Project
      const project = await Projects.findOneAndUpdate({_id: mongoose.Types.ObjectId(projectId)},
        {
          "details.external.examiner": examiner._id
        },
        {new: true}
      ).populate('students', '-_id name email student_details.regNo')
        .populate({path: 'details.internal.examiner', model: 'Users', select: 'name ugpc_details.designation'})
        .populate({path: 'details.external.examiner', model: 'Users', select: 'name ugpc_details.designation'})
        .select('students title details.supervisor');
      const studentEmails = await project.students.map(student => student.email);

      //Adding Project to Examiner Details
      const a = await Users.updateOne({_id: examiner._id}, {
        $push: {
          "ugpc_details.projects": {
            project: projectId
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
                 ${project.students.map((student, index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' : ''}</b></p>`)}
                <p>The Title of Project is: ${title}</p>
                <br/>
                <p>It will be appreciated if you kindly fix a suitable date for the Viva-Voce Examination of the students.</p>
                <br/>
                <p>Regards!</p>
            `,
        attachments: [{filename: originalname, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
                <p>Regards!</p>
            `
      };
      sendEmail(examinerEmailData);
      sendEmail(studentsEmailData);
      await res.json({success: 'Assigned', examiner: project.details.external.examiner})
    }

  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.fetchExternalExaminers = async (req, res) => {
  try {
    const {projectId, supervisorId} = req.query;
    //Finding Examiner with minimum Numbers of Projects
    const examiners = await Users.aggregate([
      {
        $match: {
          $and: [
            {"ugpc_details.committeeType": 'Evaluation'},
            {"ugpc_details.projects.project": {$ne: mongoose.Types.ObjectId(projectId)}},
            {"_id": {$ne: mongoose.Types.ObjectId(supervisorId)}}
          ]
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          "ugpc_details.designation": 1,
          projectsCount: {
            $cond: {
              if: {
                $isArray: "$ugpc_details.projects"
              }, then: {
                $size: "$ugpc_details.projects"
              }, else: "0"
            }
          }
        }
      },
      {$sort: {projectsCount: -1}}
    ]);
    await res.json(examiners)

  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.assignExternalManual = async (req, res) => {
  try {
    const {projectId, originalname, filename, title, examinerId} = req.body;
    const examiner = await Users.findOne({"_id": examinerId})
      .select('name email -_id');
    //Assigning ExternalExaminer-Updating Project
    const project = await Projects.findOneAndUpdate({_id: mongoose.Types.ObjectId(projectId)},
      {
        "details.external.examiner": examinerId
      },
      {new: true}
    ).populate('students', '-_id name email student_details.regNo')
      .populate({path: 'details.internal.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .populate({path: 'details.external.examiner', model: 'Users', select: 'name ugpc_details.designation'})
      .select('students title details.supervisor');
    const studentEmails = await project.students.map(student => student.email);

    //Adding Project to Examiner Details
    const a = await Users.updateOne({_id: examinerId}, {
      $push: {
        "ugpc_details.projects": {
          project: projectId
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
             ${project.students.map((student, index) => `<p><b>Mr, ${student.name}, Registration No. ${student.student_details.regNo} ${index === 1 ? '&' : ''}</b></p>`)}
            <p>The Title of Project is: ${title}</p>
            <br/>
            <p>It will be appreciated if you kindly fix a suitable date for the Viva-Voce Examination of the students.</p>
            <br/>
            <p>Regard!</p>
        `,
      attachments: [{filename: originalname, path: `${process.env.CLIENT_URL}/static/pdf/${filename}`}]
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
            <p>Regards!</p>
        `
    };
    sendEmail(examinerEmailData);
    sendEmail(studentsEmailData);
    await res.json({success: 'Assigned', examiner: project.details.external.examiner})

  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.fetchAssignedForEvaluation = async (req, res) => {
  try {
    const {userId} = req.params;
    const results = await Projects.aggregate([
      {
        $match: {$or: [{"details.internal.examiner": mongoose.Types.ObjectId(userId)}, {"details.external.examiner": mongoose.Types.ObjectId(userId)}]}
      },
      {$unwind: "$documentation.visionDocument"},
      {
        $match: {
          $or: [{"documentation.visionDocument.status": 'Approved'}, {"documentation.visionDocument.status": 'Approved With Changes'}]
        }
      },
      {
        $project: {
          "department": 1,
          "documentation.visionDocument.title": 1,
          "documentation.finalDocumentation": 1,
          "details.supervisor": 1,
          "details.internal": 1,
          "details.external": 1,
          "details.marks.internal": 1,
          "details.marks.external": 1,
          "students": 1
        }
      },
      {$unwind: "$documentation.finalDocumentation"}

    ]);
    const projects = await Projects.populate(results, [
      {path: "details.supervisor", model: "Users", select: "name supervisor_details.position"},
      {path: "students", model: "Users", select: "name student_details.regNo profileImage"}
    ]);
    const marks = await Users.findOne({"role": "Chairman DCSSE"})
      .select('chairman_details.settings.marksDistribution.internal chairman_details.settings.marksDistribution.external -_id');
    await res.json({
      projects,
      marks: marks ? marks.chairman_details.settings.marksDistribution : {
        proposal: 10,
        supervisor: 10,
        internal: 30,
        external: 50
      }
    })
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.evaluateInternalExternal = async (req, res) => {
  try {
    const {projectId, marks, type} = req.body;
    const result = await Projects.updateOne({"_id": projectId}, {
      [`details.marks.${type}`]: marks
    });
    await res.json({success: 'Marks Added'})
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.fetchForApprovalLetter = async (req, res) => {
  try {
    const result = await Projects.aggregate([
      {$unwind: "$documentation.visionDocument"},
      {
        $match: {
          $or: [{"documentation.visionDocument.status": 'Approved'}, {"documentation.visionDocument.status": 'Approved With Changes'}]
        }
      },
      {
        $project: {
          "department": 1,
          "documentation.visionDocument.title": 1,
          "details.supervisor": 1,
          "details.acceptanceLetter": 1,
          "students": 1
        }
      },
    ]);
    const projects = await Projects.populate(result, [
      {path: "details.supervisor", model: "Users", select: "name supervisor_details.position"},
      {path: "students", model: "Users", select: "name student_details.regNo student_details.batch"}
    ]);
    const chairman = await Users.findOne({role: 'Chairman DCSSE'})
      .select('-_id name');
    await res.json({projects, chairman})
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.fetchForExternalLetter = async (req, res) => {
  try {
    const result = await Projects.aggregate([
      {$unwind: "$documentation.visionDocument"},
      {
        $match: {
          $or: [{"documentation.visionDocument.status": 'Approved'}, {"documentation.visionDocument.status": 'Approved With Changes'}]
        }
      },
      {
        $project: {
          "department": 1,
          "documentation.visionDocument.title": 1,
          "documentation.finalDocumentation": 1,
          "details.supervisor": 1,
          "details.internal": 1,
          "details.external": 1,
          "details.acceptanceLetter": 1,
          "students": 1
        }
      },
      {$unwind: "$documentation.finalDocumentation"},
      {
        $match: {
          "documentation.finalDocumentation.status": {$nin: ['Available for Internal', 'Completed', 'Internal Scheduled']}
        }
      },
      {
        $sort: {"details.external.date": 1}
      }
    ]);
    const projects = await Projects.populate(result, [
      {path: "details.supervisor", model: "Users", select: "name supervisor_details.position"},
      {path: "details.internal.examiner", model: "Users", select: "name ugpc_details.designation"},
      {path: "details.external.examiner", model: "Users", select: "name ugpc_details.designation"},
      {path: "students", model: "Users", select: "name student_details.regNo student_details.batch"}
    ]);

    await res.json(projects)
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.fetchCompleted = async (req, res) => {
  try {
    const result = await Projects.aggregate([
      {$unwind: "$documentation.visionDocument"},
      {
        $match: {
          $or: [{"documentation.visionDocument.status": 'Approved'}, {"documentation.visionDocument.status": 'Approved With Changes'}]
        }
      },
      {
        $project: {
          "department": 1,
          "documentation.visionDocument.title": 1,
          "documentation.finalDocumentation": 1,
          "details.supervisor": 1,
          "details.internal": 1,
          "details.external": 1,
          "details.marks": 1,
          "details.acceptanceLetter": 1,
          "students": 1
        }
      },
      {$unwind: "$documentation.finalDocumentation"},
      {
        $match: {
          "documentation.finalDocumentation.status": 'Completed'
        }
      }
    ]);
    const projects = await Projects.populate(result, [
      {path: "details.supervisor", model: "Users", select: "name supervisor_details.position"},
      {path: "details.internal.examiner", model: "Users", select: "name ugpc_details.designation"},
      {path: "details.external.examiner", model: "Users", select: "name ugpc_details.designation"},
      {path: "students", model: "Users", select: "name student_details.regNo student_details.batch"}
    ]);

    await res.json(projects)
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.addMarksSupervisor = async (req, res) => {
  try {
    const {marks, projectId} = req.body;
    const result = await Projects.update({"_id": projectId}, {
      $set: {
        "details.marks.supervisor": marks
      }
    });
    if (result.ok) {
      await res.json({message: "Marks Added"})
    }
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.scheduleMeetingSupervisor = async (req, res) => {
  try {
    const {purpose, selectedDate, projectId} = req.body;
    const result = await Projects.findOneAndUpdate({"_id": projectId}, {
      $push: {
        "details.meetings": {
          purpose,
          date: selectedDate,
          isAttended: false
        }
      }
    }, {new: true})
      .select('details.meetings students')
      .populate('students', '-_id email');
    const emails = result.students.map(student => student.email);
    const studentsEmailData = {
      from: "noreply@node-react.com",
      to: emails,
      subject: "Meeting Scheduled With Supervisor",
      text: `Dear Student,\n your meeting with supervisor is scheduled on ${moment(selectedDate).format('MM/DD/YY, h:mm A')}\n Please be on time.`,
      html: `
            <p>Dear Student,</p>
            <p>Your meeting with supervisor is scheduled on ${moment(selectedDate).format('MM/DD/YY, h:mm A')}</p>
            <p>The purpose of meeting is: ${purpose}</p>
            <p>Please be on time</p>
            <br/>
            <p>Regards!</p>
        `
    };
    sendEmail(studentsEmailData);
    await res.json(result.details.meetings)

  } catch (e) {
    await res.json({error: e.message})
  }

};

exports.requestMeetingSupervisor = async (req, res) => {
  try {
    const {purpose, username, projectTitle, supervisorEmail} = req.body;

    const emailData = {
      from: "noreply@node-react.com",
      to: supervisorEmail,
      subject: "Request for Scheduling a Meeting",
      text: `Respected Supervisor,\n Student named as ${username}, with Project Title ${projectTitle} has requested you to schedule a meeting for ${purpose}. Please find a suitable time for meeting and schedule it`,
      html: `
            <p>Respected Supervisor,</p>
            <p>Student name as <b>${username}</b> with Project Title <b>${projectTitle}</b> has requested you to schedule a meeting</p>
            <p>The purpose of meeting is: <b>${purpose}</b></p>
            <p>Please find a suitable time and schedule a meeting</p>
            <br/>
            <p>Regards!</p>
        `
    };
    sendEmail(emailData);

    await res.json({message: 'Success'})
  } catch (e) {
    await res.json({error: e.message})
  }
};
exports.markMeetingSupervisorAsAttended = async (req, res) => {
  try {
    const {meetingId, projectId} = req.body;
    const result = await Projects.findOneAndUpdate({"_id": projectId, "details.meetings._id": meetingId}, {
      $set: {
        "details.meetings.$.isAttended": true
      }
    }, {new: true})
      .select('details.meetings');
    await res.json(result.details.meetings)
  } catch (e) {
    await res.json({error: e.message})
  }
};

exports.uploadPlagiarismReport = async (req, res) => {
  try {
    const {projectId, documentId} = req.body;
    const result = await Projects.findOneAndUpdate({
      "_id": projectId,
      "documentation.finalDocumentation._id": documentId
    }, {
      $set: {
        "documentation.finalDocumentation.$.plagiarismReport": {
          "originalname": req.file.originalname,
          "filename": req.file.filename,
        }
      }
    }, {new: true})
      .select('students')
      .populate('students', 'email');
    const emails = await result.students.map(student => student.email);
    const emailData = {
      from: "rafaewaqar@gmail.com",
      to: emails,
      subject: "Plagiarism Report Uploaded",
      text: `Dear Student,\n Your Supervisor has uploaded Plagiarism Report of your Project. you can Check / Download it now`,
      html: `
            <p>Dear Student,</p>
            <p>Your Supervisor has uploaded Plagiarism Report of your Project.</p>
            <p>You can Check / Download it now</p>
            <p>Plagiarism Report is Attached with this email. You can also download it from UGPC - Software</p>
            <br/>
            <p>Regards!</p>
        `,
      attachments: [{
        filename: req.file.originalname,
        path: `${process.env.CLIENT_URL}/static/pdf/${req.file.filename}`
      }]
    };
    sendEmail(emailData);
    await res.json({message: 'Success'})
  } catch (e) {
    await res.json({error: e.message})
  }
};