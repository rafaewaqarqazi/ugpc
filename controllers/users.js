const User = require('../models/users');

exports.userById =(req,res,next,id)=>{
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
