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
        const waitingR = await Projects.populate(waitingResults,{path:"students",select:'_id name department student_details.regNo'});
        const waiting = await Projects.populate(waitingR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});
        //Waiting For Meeting Schedule Query
        const approvedForMeetingResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved for Meeting"}},
            {$sort:{"documentation.visionDocument.uploadedAt":1}}
        ]);
        const approvedForMeetingR = await Projects.populate(approvedForMeetingResults,{path:"students",select:'_id name department student_details.regNo'});
        const approvedForMeeting = await Projects.populate(approvedForMeetingR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});
        //Meeting Scheduled Query
        const meetingScheduledResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Meeting Scheduled"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const meetingScheduledR = await Projects.populate(meetingScheduledResults,{path:"students",select:'_id name department student_details.regNo'});
         const meetingScheduled =   await Projects.populate(meetingScheduledR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});

        //Approved with Changes Query
        const approvedWithChangesResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved With Changes"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approvedWithChangesR = await Projects.populate(approvedWithChangesResults,{path:"students",select:'_id name department student_details.regNo'})
        const approvedWithChanges =   await Projects.populate(approvedWithChangesR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});

        //Approved Query

        const approvedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Approved"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const approvedR = await Projects.populate(approvedResults,{path:"students",select:'_id name department student_details.regNo'})
        const approved =   await Projects.populate(approvedR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});

        //Rejected Query
        const rejectedResults= await Projects.aggregate([
            {$match:{department:req.params.committee}},
            {$project:{students: 1,"documentation.visionDocument":1,title:1}},
            {$unwind:"$documentation.visionDocument"},
            {$match:{"documentation.visionDocument.status":"Rejected"}},
            {$sort:{"documentation.visionDocument.updatedAt":1}}
        ]);
        const rejectedR = await Projects.populate(rejectedResults,{path:"students",select:'_id name department student_details.regNo'})
        const rejected =   await Projects.populate(rejectedR,{path:"documentation.visionDocument.comments.author",select:'_id name role department'});
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
