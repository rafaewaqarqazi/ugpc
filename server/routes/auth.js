const express = require('express');
const {userById} = require("../controllers/users");
const {
  studentSignup,
  ugpcSignup,
  verifyEmail,
  isChairman,
  signin,
  requireSignin,
  getUser,
  getChairmanName,
  forgotPassword,
  resetPassword,
  resendVerificationCode
} = require('../controllers/auth');
const router = express.Router();

router.get('/:userId', getUser);
router.get('/fetch/chairmanName', getChairmanName);
router.post('/student/signup', studentSignup);
router.post('/ugpc/signup', requireSignin, isChairman, ugpcSignup);
router.put('/verify-email', verifyEmail);
router.put('/resend/code', resendVerificationCode);
router.post('/signin', signin);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

router.param("userId", userById);
module.exports = router;