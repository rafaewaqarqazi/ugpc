const User = require('../models/users');

exports.userById =(req,res,next,id)=>{
    User.findById(id)
        .then( user=> {
            const {_id, name, email, role,additionalRole,department,isEmailVerified,student_details,ugpc_details,admin_details,supervisor_details} = user;
            const loggedInUser = {
                _id,
                email,
                name,
                role,
                additionalRole,
                department,
                isEmailVerified,
                student_details:role==='Student'? student_details :undefined,
                ugpc_details: additionalRole==='UGPC_Member'? ugpc_details :undefined,
                admin_details: role==='Chairman'? admin_details :undefined,
                supervisor_details:role === 'Supervisor' ? supervisor_details : undefined
            };
            req.profile = loggedInUser;
            next();
        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};
