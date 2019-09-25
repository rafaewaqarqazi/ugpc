const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
require('dotenv').config();
const User = require('../models/users');
const {sendEmail} = require("../helpers");
const generator = require('generate-password');


exports.studentSignup = async (req, res)=>{

    const userExists = await User.findOne({email: req.body.email});
    if (userExists) return res.status(403).json({
        error: "User Already Exists"
    });
    const emailVerCode = Math.floor(Math.random() * 100000000);

    const user = await new User({
        ...req.body,
        emailVerificationCode: emailVerCode
    });
    const student = await user.save();
    if (student){
        const {email}=req.body;
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Email Verification Instructions",
            text: `Please use the following code for email verification ${emailVerCode}`,
            html: `<p>Please use the following code for email verification</p> <h3>${emailVerCode}</h3>`
        };

        sendEmail(emailData)
            .then(()=>{
                return res.status(200).json({
                    _id:student._id,
                    message: `Email has been sent to ${email}. Please check your email for verification`
                });
            });
    }
};

exports.ugpcSignup = async (req, res)=>{
    const {name, email, role, committee,position,committeeType,supervisorPosition,additionalRole} = req.body;
    const userExists = await User.findOne({email: email});
    if (userExists) return res.status(403).json({
        error: "User Already Exists"
    });
    if (role === 'UGPC_Member' && position === 'Chairman_Committee' && committeeType === 'Defence'){
        console.log('Inside Defence Chairman Check')
        const chairmanExists = await User.findOne({$and:[{"ugpc_details.committees":{ $in: [committee]}},{"ugpc_details.position":'Chairman_Committee'},{"ugpc_details.committeeType":'Defence'}]});
        if (chairmanExists) return res.status(403).json({
            error: "Defence Committee Already has a Chairman"
        });
    }
    if (role === 'UGPC_Member' && position === 'Chairman_Committee' && committeeType === 'Evaluation'){
        console.log('Inside Defence Chairman Check')
        const chairmanExists = await User.findOne({$and:[{"ugpc_details.committees":{ $in: [committee]}},{"ugpc_details.position":'Chairman_Committee'},{"ugpc_details.committeeType":'Evaluation'}]});
        if (chairmanExists) return res.status(403).json({
            error: "Defence Committee Already has a Chairman"
        });
    }
    if (req.body.role === 'UGPC_Member' && position === 'Coordinator'){
        const coordinatorExists = await User.findOne({$and:[{"ugpc_details.committees":{ $in: [committee]}},{"ugpc_details.position":'Coordinator'}]});
        if (coordinatorExists) return res.status(403).json({
            error: "Committee Already has a Coordinator"
        });
    }

    const password = generator.generate({
        length: 10,
        numbers: true
    });


    const user = await new User({
        name,
        email,
        role,
        additionalRole,
        password,
        isEmailVerified: true,
        ugpc_details:additionalRole === 'UGPC_Member'?{
            committees:[committee],
            position,
            committeeType
        }:undefined,
        supervisor_details:role === 'Supervisor' ? {position:supervisorPosition} : undefined,
        chairman_details: role === 'Chairman DCSSE'?{}:undefined
    });
    const newUser = await user.save();
    if (newUser){
        const {email}=req.body;
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Email Verification Instructions",
            text: `Your Account has been created. Please use following email & password to login. Email: ${email}, Password:  ${password}`,
            html: `<p>Your Account has been created. Please use following email & password to login</p> <h3>Email: ${email}</h3> <h3>Password: ${password}</h3>`
        };

        sendEmail(emailData)
            .then(()=>{
                return res.status(200).json({
                    message: `Account has been created`
                });
            });
    }
};
exports.signin = (req, res) => {
    console.log('req.body',req.body);
    const {email, password} = req.body;
    User.findOne({email},(err, user) => {
        if (err || !user){
            return res.status(401).json({
                error:"User does not exist"
            })
        }

        if (!user.authenticate(password)){
            return res.status(401).json({
                error:"Email/Password does not match"
            })
        }
        //Generating Key
        const {_id, name, email, role,isEmailVerified,ugpc_details,additionalRole,supervisor_details} = user;

        const token = jwt.sign({ _id, role},process.env.JWT_SECRET);
        const loggedInUser = {
            _id,
            email,
            name,
            role,
            additionalRole,
            isEmailVerified,
            ugpc_details: additionalRole === 'UGPC_Member' ? ugpc_details:undefined,
            supervisor_details:role === 'Supervisor' ? supervisor_details : undefined
        };
        return res.json({
            token,
            user:loggedInUser
        });



    })
};


exports.isChairman = (req, res, next) => {
    let chairman = req.auth && req.auth.role === "Chairman DCSSE";
    if (!chairman){
        return res.status(403).json({
            error: "You are Not Authorized to perform this action"
        })
    }
    next();
};
exports.isStudent = (req, res, next) => {
    let student = req.auth && req.auth.role === "Student";
    if (!student){
        return res.status(403).json({
            error: "You are Not Authorized to perform this action"
        })
    }
    next();
};


exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});


exports.verifyEmail = (req, res) => {
    const { emailVerificationCode,_id } = req.body;
        console.log(req.body);
    User.findOne({$and:[{_id},{emailVerificationCode}]}).then(user => {
        // if err or no user
        if (!user)
            return res.status(401).json({
                error: "Invalid Code!"
            });


        const updatedFields = {
            isEmailVerified:true,
            emailVerificationCode: undefined
        };

        Object.assign(user,updatedFields);


        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Your Email Has been verified. You can Sign-in Now`
            });
        });
    });
};

// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};


exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
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
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
exports.getUser = (req,res)=>{
    res.json(req.profile)
};
exports.checkEligibility = (req,res) => {
    res.json(req.auth);
};
exports.getChairmanName = async (req, res)=>{
    try {
        const chairman = await User.findOne({role:'Chairman DCSSE'})
            .select('-_id name');
        await res.json(chairman)
    }
    catch (e) {
        await res.json({error:e.message})
    }

}