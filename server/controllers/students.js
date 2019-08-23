const Users = require('../models/users');
const Projects = require('../models/projects');
const path = require('path');

exports.changeEligibility = (req, res)=>{
    let student = req.profile;
    console.log(req.body.status);
    Users.update({_id:req.params.userId},
        {
            $set:{"student_details.isEligible":req.body.status}
        })
        .then(data => {
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
                            "document":{
                               "originalname":req.file.originalname,
                                "filename":req.file.filename
                            }
              }
           }
       };

        Projects.findByIdAndUpdate(req.params.id,update)
        .then(project =>{
            res.json({message: "Vision Document Uploaded"});
        })
            .catch(err => console.log(err.message));


};
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