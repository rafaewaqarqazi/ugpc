const Projects = require('../models/projects');

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
        .populate('students','_id name')
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

exports.fetchVisionDocsByCommittee =async (req, res)=>{

    try {
        //Waiting For Initial approval Query
        const waitingResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Waiting for Initial Approval"}},
            {$sort:{"documentation.visionDocument.uploadedAt":1}}
        ]);
        const waiting = await Projects.populate(waitingResults,{path:"students",select:'_id name department student_details.regNo'});
        //Waiting For Meeting Schedule Query
        const waitingForScheduleResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Waiting for Meeting Schedule"}},
            {$sort:{"documentation.visionDocument.uploadedAt":1}}
        ]);
        const waitingForSchedule = await Projects.populate(waitingForScheduleResults,{path:"students",select:'_id name department student_details.regNo'});
        //Meeting Scheduled Query
        const meetingScheduledResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Meeting Scheduled"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const meetingScheduled = await Projects.populate(meetingScheduledResults,{path:"students",select:'_id name department student_details.regNo'});

        //Approved with Changes Query
        const approvedWithChangesResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved With Changes"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approvedWithChanges = await Projects.populate(approvedWithChangesResults,{path:"students",select:'_id name department student_details.regNo'});

        //Approved Query

        const approvedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approved = await Projects.populate(approvedResults,{path:"students",select:'_id name department student_details.regNo'});

        //Rejected Query
        const rejectedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Rejected"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const rejected = await Projects.populate(rejectedResults,{path:"students",select:'_id name department student_details.regNo'});
       await res.json({waiting,waitingForSchedule,meetingScheduled,approvedWithChanges,approved,rejected})
    }
    catch(err){
        res.status(400).json(err.message)
    }
};
