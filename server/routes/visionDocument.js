const express = require('express');
const router = express.Router();
const {
    fetchVisionDocsByCommitteeCoordinator,
    commentOnVision,
    changeStatus,
    scheduleVisionDefence,
    fetchMeetings,
    addMarks
} = require('../controllers/visionDocument');
const {requireSignin} = require('../controllers/auth');



router.get('/fetch/byMeetings',fetchMeetings)
router.get('/fetch/byCommittees',fetchVisionDocsByCommitteeCoordinator);
router.put('/comment',commentOnVision);
router.put('/changeStatus',changeStatus);
router.put('/scheduleDefence',scheduleVisionDefence);
router.put('/addMarks',addMarks)
module.exports = router;