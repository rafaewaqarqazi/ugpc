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
    removeUser,
    fetchCommittees,
    fetchNotInCommittee,
    addMemberToCommittee,
    removeFromCommitteeDepartment,
    removeFromCommittee,
    fetchStudentsBarData,
    fetchAllSupervisors,
    fetchBatches,
    fetchMarksDistribution
} = require('../controllers/users');
const upload = require('../upload');
const {requireSignin,isChairman} = require('../controllers/auth');

router.put('/chairman/settings/marksDistribution',requireSignin,marksDistribution);
router.put('/chairman/settings/batch/add',requireSignin,isChairman,addNewBatch);
router.put('/chairman/settings/batch/remove',requireSignin,isChairman,removeBatch);
router.get('/chairman/settings/fetch/batches',fetchBatches);
router.get('/chairman/settings/fetch/marksDistribution',fetchMarksDistribution);


router.put('/profile/upload/:type',requireSignin,upload.single('file'),uploadProfileImage);

router.get('/fetchAll',requireSignin,fetchAllUsers);
router.get('/fetch/studentsBarData',requireSignin,fetchStudentsBarData);
router.get('/fetch/supervisors',requireSignin,fetchAllSupervisors);
router.get('/fetchCommittees',requireSignin,fetchCommittees);
router.get('/fetchNotInCommittee',requireSignin,fetchNotInCommittee);

router.put('/change/name',requireSignin,changeName);
router.put('/change/password',requireSignin,changePassword);

//Chairman
router.put('/committee/addMember',requireSignin,isChairman,addMemberToCommittee);
router.put('/committee/remove/department',requireSignin,isChairman,removeFromCommitteeDepartment);
router.put('/committee/remove/committee',requireSignin,isChairman,removeFromCommittee);
router.delete('/remove/:userId',requireSignin,isChairman,removeUser);
module.exports = router;