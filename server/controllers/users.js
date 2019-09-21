const User = require('../models/users');

exports.userById =(req,res,next,id)=>{
    User.findById(id)
        .populate('supervisor_details.projects.project','department students details.backlog details.sprint details.estimatedDeadline details.acceptanceLetter.issueDate')
        .then( user=> {
            User.populate(user,{path:'supervisor_details.projects.project.students',model:'Users',select:'name student_details.regNo'}).then(result =>{
                const {_id, name, email, role,additionalRole,department,isEmailVerified,student_details,ugpc_details,admin_details,supervisor_details} = result;
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

        })
        .catch(err => {
            res.status(400).json({error:err});
            next();
        })
};
