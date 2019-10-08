const express = require('express');
const router = express.Router();
const {
    marksDistribution,
    uploadProfileImage,
    changePassword,
    changeName,
    addNewBatch,
    removeBatch,
    fetchAllUsers,
    removeUser
} = require('../controllers/users');
const upload = require('../upload');
const {requireSignin} = require('../controllers/auth');

router.put('/chairman/settings/marksDistribution',marksDistribution);
router.put('/chairman/settings/batch/add',addNewBatch);
router.put('/chairman/settings/batch/remove',removeBatch);
router.put('/profile/upload/:type',upload.single('file'),uploadProfileImage);
router.get('/fetchAll',fetchAllUsers)
router.put('/change/name',changeName);
router.put('/change/password',changePassword);
router.delete('/remove/:userId',removeUser)
module.exports = router;