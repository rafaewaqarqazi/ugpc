const User = require('../models/users');

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