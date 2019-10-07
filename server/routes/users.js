const express = require('express');
const router = express.Router();
const {
    marksDistribution,
    uploadProfileImage,
    changePassword,
    changeName,
} = require('../controllers/users');
const upload = require('../upload');
const {requireSignin} = require('../controllers/auth');

router.put('/chairman/settings/marksDistribution',marksDistribution);
router.put('/profile/upload/:type',upload.single('file'),uploadProfileImage);

router.put('/change/name',changeName);
router.put('/change/password',changePassword);
module.exports = router;