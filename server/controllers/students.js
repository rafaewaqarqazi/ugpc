const Users = require('../models/users');
const Projects = require('../models/projects');
const path = require('path');
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

exports.uploadAvatar = async (req, res) => {
    try {
        console.log(req.params.id);


        await Projects.findByIdAndUpdate(req.params.id,{
            documentation:{
                visionDocument:{$push: {
                    ...req.body,
                    docs:{$push:{
                        originalname:req.file.originalname,
                        filename:req.file.filename
                    }}
                }}
            }
        });
        await res.json({message: "Uploaded"});
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
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
    let s =[]
    projects.map((project,i) =>{
        s[i]=project._id
    });
    const users = await Users.where('role').equals('Student').where('_id').nin(s).select('_id name email role');
    await res.json(users)
};