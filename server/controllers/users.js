const User = require('../models/users');
const fs = require('fs');
const path = require('path');
require('dotenv').config()
exports.userById =(req,res,next,id)=>{
    User.findById(id)
        .populate('supervisor_details.projects.project','department students details.backlog details.sprint details.estimatedDeadline details.acceptanceLetter.issueDate')
        .then( user=> {
            User.populate(user,{path:'supervisor_details.projects.project.students',model:'Users',select:'name student_details.regNo'}).then(result =>{
                const {_id, name, email, role,additionalRole,department,isEmailVerified,student_details,ugpc_details,chairman_details,supervisor_details,createdAt,profileImage} = result;
                const loggedInUser = {
                    _id,
                    email,
                    name,
                    role,
                    createdAt,
                    additionalRole,
                    department,
                    profileImage,
                    isEmailVerified,
                    student_details:role==='Student'? student_details :undefined,
                    ugpc_details: additionalRole==='UGPC_Member'? ugpc_details :undefined,
                    chairman_details: role==='Chairman DCSSE'? chairman_details :undefined,
                    supervisor_details:role === 'Supervisor' ? supervisor_details : undefined
                };
                req.profile = loggedInUser;
                next();
            })

        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};

exports.marksDistribution = async (req, res) =>{
    try {
        const {userId,marks} = req.body;
        const user = await User.findByIdAndUpdate(userId,{
            "chairman_details.settings.marksDistribution":marks
        })
            .select('chairman_details');

        await res.json(user)
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.uploadProfileImage = (req, res)=>{
    const {oldImage,userId} = req.body;
    fs.unlink(`static/images/${oldImage}`,err => {
        if(err){
            console.log(err)
        }
        User.updateOne({"_id":userId},{
            $set:{"profileImage.filename":req.file.filename}
        }).then(result =>{
            if(result.ok){
               res.json(req.file.filename)
            }
        }).catch(error => res.json({error:error.message}))

    });
};

exports.changeName = async (req,res)=>{
    try {
        const {name,userId} = req.body;
        const result = await User.updateOne({"_id":userId},{
            $set:{"name":name}
        });
        if(result.ok){
            await res.json({message:'Successfully Updated'})
        }
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.changePassword = async (req,res)=>{
    try {
        const {oldPassword,newPassword,userId} = req.body;
        const user = await User.findOne({"_id":userId});
        if (!user.authenticate(oldPassword)){
            return res.status(401).json({
                error:"Old Password is incorrect"
            })
        }
        const updatedFields = {
            password: newPassword
        };

        Object.assign(user,updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Password Changed Successfully`
            });
        });
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.addNewBatch = async (req,res)=>{
    try {
        const {newBatch,userId} = req.body;
        const result = await User.findByIdAndUpdate(userId,{
            $addToSet:{
                "chairman_details.settings.batches":newBatch
            }
        },{new:true})
            .select('chairman_details.settings.batches');
        await res.json(result)
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.removeBatch = async (req,res)=>{
    try {
        const {batch,userId} = req.body;
        const result = await User.findByIdAndUpdate(userId,{
            $pull:{
                "chairman_details.settings.batches":batch
            }
        },{new:true})
            .select('chairman_details.settings.batches');
        await res.json(result)
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.fetchAllUsers = async (req,res)=>{
    try {
        const users = await User.aggregate([
            {
              $project:{"hashed_password":0,"salt":0,"resetPasswordLink":0,"emailVerificationCode":0}
            },
            {
                $group:{
                    "_id":"$role",
                    users:{$push:"$$ROOT"}
                }
            }
        ]);
        await res.json(users);
    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.removeUser = async (req,res)=>{
    try {
        const result = await User.remove({"_id":req.params.userId});
        await res.json(result);
    }catch (e) {
        await res.json({error:e.message})
    }
}