const User = require('../models/users');


exports.studentById=(req,res,next,id)=>{
    User.findById(id)
        .then( user=> {
            req.profile = user;
            next();
        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};