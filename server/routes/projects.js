const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    findByStudentId,
    fetchWaitingVisionDocuments,
    fetchVisionDocsByCommitteeCoordinator,
    commentOnVision,
    changeStatus,
    scheduleVisionDefence,
    fetchMeetings,
    assignSupervisor,
    generateAcceptanceLetter
} = require('../controllers/projects');
const {requireSignin} = require('../controllers/auth');

router.get('/by/:byStudentId',(req,res)=>{
    res.json(req.project);
});
router.get('/all',getAllProjects);
router.get('/fetch/waiting',fetchWaitingVisionDocuments);
router.get('/visionDocument/meetings/:committee',fetchMeetings)
router.get('/fetch/:committee',fetchVisionDocsByCommitteeCoordinator);
router.put('/visionDocument/comment',commentOnVision);
router.put('/visionDocument/changeStatus',changeStatus);
router.put('/visionDocument/schedule/visionDefence',scheduleVisionDefence);
router.put('/supervisor/assign',assignSupervisor);
router.put('/generate/acceptanceLetter',generateAcceptanceLetter)
router.param('byStudentId',findByStudentId);
module.exports = router;