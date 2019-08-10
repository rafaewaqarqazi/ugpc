const Users = require('../models/users');
const Projects = require('../models/projects');
const path = require('path');
const formidable = require('formidable');
exports.makeEligible = (req, res)=>{
    let student = req.profile;
    console.log(student);
    student.student_details.isEligible = true;
    student.save()
        .then(data => {
            res.json({message:'Success'})
        })
        .catch(err => {
            res.status(400).json({error:err})
        })
};

exports.uploadVisionDocument = (req, res) => {
       const update = {
           documentation:{
               visionDocument:[ {
                       title:req.body.title,
                       abstract:req.body.abstract,
                       scope:req.body.scope,
                       majorModules:JSON.parse(req.body.majorModules),
                       docs:[{
                               originalname:req.file.originalname,
                               filename:req.file.filename
                           }]
                   }]
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
   console.log(req.profile);
    const users = await Users.where('role').equals('Student')
        .where({"student_details.isEligible": "Eligible"})
        .where({"student_details.department": req.profile.student_details.department})
        .where('_id').nin(ids)
        .select('_id name email role student_details');
    await res.json(users)
};