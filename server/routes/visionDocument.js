const express = require('express');
const router = express.Router();
const {
  fetchVisionDocsByCommitteeCoordinator,
  commentOnVision,
  changeStatus,
  scheduleVisionDefence,
  fetchMeetings,
  addMarks,
  fetchBySupervisor,
  fetchVisionDocsPieData,
  editCommentOnVision,
  deleteCommentOnVision
} = require('../controllers/visionDocument');
const {requireSignin} = require('../controllers/auth');


router.get('/fetch/byMeetings', requireSignin, fetchMeetings);
router.get('/fetch/bySupervisor/:supervisorId', requireSignin, fetchBySupervisor);
router.get('/fetch/byCommittees', requireSignin, fetchVisionDocsByCommitteeCoordinator);
router.get('/fetch/visionDocsPieData', requireSignin, fetchVisionDocsPieData);
router.put('/comment', requireSignin, commentOnVision);
router.put('/comment/edit', requireSignin, editCommentOnVision);
router.put('/comment/delete', requireSignin, deleteCommentOnVision);
router.put('/changeStatus', requireSignin, changeStatus);
router.put('/scheduleDefence', requireSignin, scheduleVisionDefence);
router.put('/addMarks', requireSignin, addMarks);
module.exports = router;