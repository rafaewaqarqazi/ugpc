const express = require('express');
const  {studentSignup,verifyEmail} = require('../../controllers/auth');
const  {studentById} = require('../../controllers/students');
// const {userSignUpValidator} = require('../../validator');
const router = express.Router();


router.post('/student/signup', studentSignup);
router.put('/verify-email',verifyEmail);
// router.post('/signin', signin);
// router.get('/signout', signout);

router.param("userId", studentById);
module.exports = router;