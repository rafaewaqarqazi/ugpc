const express = require('express');
const {userById} = require("../../controllers/users");
const  {
    studentSignup,
    ugpcSignup,
    verifyEmail,
    isChairman,
    signin,
    requireSignin,
    signout
} = require('../../controllers/auth');
const {
    userSignUpValidator
} = require('../../validator');
const router = express.Router();


router.post('/student/signup',userSignUpValidator, studentSignup);
router.post('/ugpc/signup',requireSignin,isChairman,userSignUpValidator, ugpcSignup);
router.put('/verify-email',verifyEmail);
router.post('/signin', signin);
router.get('/signout', signout);

router.param("userId", userById);
module.exports = router;