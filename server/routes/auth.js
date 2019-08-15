const express = require('express');
const {userById} = require("../controllers/users");
const  {
    studentSignup,
    ugpcSignup,
    verifyEmail,
    isChairman,
    signin,
    requireSignin,
    checkEligibility,
    getUser
} = require('../controllers/auth');
const {
    userSignUpValidator
} = require('../validator');
const router = express.Router();

router.get('/:userId',getUser);
router.post('/student/signup',userSignUpValidator, studentSignup);
router.post('/ugpc/signup',requireSignin,isChairman,userSignUpValidator, ugpcSignup);
router.get('/isEligible',requireSignin,checkEligibility);
router.put('/verify-email',verifyEmail);
router.post('/signin', signin);


router.param("userId", userById);
module.exports = router;