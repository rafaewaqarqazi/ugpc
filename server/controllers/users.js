const User = require('../models/users');
const fs = require('fs');
const {sendEmail} = require("../helpers");
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
};
exports.fetchCommittees = async (req,res)=>{
    try {
        const result = await User.aggregate([
            {
                $match:{$or:[{"ugpc_details.committeeType":'Defence'},{"ugpc_details.committeeType":"Evaluation"}]}
            },
            {
                $project:{"hashed_password":0,"salt":0,"resetPasswordLink":0,"emailVerificationCode":0}
            },
            {
                $group:{
                    "_id":"$ugpc_details.committeeType",
                    members:{$push:"$$ROOT"}
                }
            }

        ])
        await res.json(result);
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.fetchNotInCommittee = async (req,res)=>{
    try {
        const result = await User.aggregate([
            {
                $match:{$and:[{"ugpc_details.committeeType":'None'},{"additionalRole":"UGPC_Member"}]}
            },
            {
                $project:{"hashed_password":0,"salt":0,"resetPasswordLink":0,"emailVerificationCode":0}
            },
        ])
        await res.json(result);
    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.addMemberToCommittee = async (req,res)=>{
    try {
        const {userId,department,position,committeeType} = req.body;
        if (position === 'Chairman_Committee' || position === 'Coordinator'){
            const userExists = await User.find({$and:[{"ugpc_details.position":position},{"ugpc_details.committees":{$in:[department]}},{"ugpc_details.committeeType":committeeType}]});
            if (userExists.length > 0) {
                return res.status(200).json({
                    error: "Committee Already has a Member on this Position"
                });
            }
        }
        const result = await User.findOneAndUpdate({"_id":userId},
            {
                $addToSet:{
                    "ugpc_details.committees":department
                },
                "ugpc_details.position":position,
                "ugpc_details.committeeType":committeeType
            })
            .select('email');

            const emailData = {
                from: "noreply@node-react.com",
                to: result.email,
                subject: `UGPC | Added In ${committeeType} Committee`,
                text: `Dear Teacher,\nChairman DCS&SE added you in ${committeeType} committee as a ${position} of committee for department ${department}.`,
                html: `
                <p>Dear Teacher,</p>
                <p>Chairman DCS&SE added you in UGPC-${committeeType} committee for department ${department}.</p>
                <p>Your Position in Committee is: ${position}</p>
                </br>
                <p>Regards</p>
            `
            };

            sendEmail(emailData)
                .then(()=>{
                    return res.json({message:'Member Added Successfully'});
                });

    }catch (e) {
        await res.json({error:e.message})
    }
};
exports.removeFromCommitteeDepartment = async (req,res) =>{
    try {
        const {userId,department,committeeType} = req.body;

        const result = await User.findOneAndUpdate({"_id":userId},
            {
                $pull:{
                    "ugpc_details.committees":department
                }
            })
            .select('email');
        const emailData = {
            from: "noreply@node-react.com",
            to: result.email,
            subject: `UGPC | Removed from ${committeeType} Committee's Department ${department}`,
            text: `Dear Teacher,\nChairman DCS&SE added removed you from UGPC-${committeeType} committee's department ${department}.`,
            html: `
                <p>Dear Teacher,</p>
                <p>Chairman DCS&SE removed you from UGPC-${committeeType} committee's department ${department}.</p>
                </br>
                <p>Regards</p>
            `
        };

        sendEmail(emailData)
            .then(()=>{
                return res.json({message:'Member Removed Successfully'})
            });


    }catch (e) {
        await res.json({error:e.message})
    }
};

exports.removeFromCommittee = async (req,res) =>{
    try {
        const {userId,committeeType} = req.body;

        const result = await User.findOneAndUpdate({"_id":userId},
            {
                $set:{
                    "ugpc_details.committees":[],
                    "ugpc_details.committeeType":'None',
                    "ugpc_details.position":undefined
                },
            }) .select('email');
        const emailData = {
            from: "noreply@node-react.com",
            to: result.email,
            subject: `UGPC | Removed from ${committeeType} Committee`,
            text: `Dear Teacher,\nChairman DCS&SE added removed you from UGPC-${committeeType} committee.`,
            html: `
                <p>Dear Teacher,</p>
                <p>Chairman DCS&SE removed you from UGPC-${committeeType} committee.</p>
                </br>
                <p>Regards</p>
            `
        };

        sendEmail(emailData)
            .then(()=>{
                return res.json({message:'Member Removed Successfully'})
            });

    }catch (e) {
        await res.json({error:e.message})
    }
};