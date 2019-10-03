const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    findByStudentId,
    assignSupervisor,
    generateAcceptanceLetter,
    findByProjectId,
    fetchFinalDocumentationsBySupervisor,
    changeFDStatus,
    fetchForEvaluation,
    scheduleInternal,
    scheduleExternal,
    fetchAssignedForEvaluation,
    evaluateInternalExternal,
    fetchForApprovalLetter
} = require('../controllers/projects');
const {requireSignin} = require('../controllers/auth');

router.get('/by/studentId/:byStudentId',(req,res)=>{
    res.json(req.project);
});
router.get('/by/projectId/:projectId',(req,res)=>{
    res.json(req.project);
});
router.get('/all',getAllProjects);
router.put('/supervisor/assign',assignSupervisor);
router.put('/generate/acceptanceLetter',generateAcceptanceLetter);
router.put('/changeFDStatus',changeFDStatus);
router.put('/schedule/internal',scheduleInternal);
router.put('/schedule/external',scheduleExternal);
router.put('/evaluate/internalExternal',evaluateInternalExternal);
router.get('/fetch/finalDocumentation/by/supervisor/:supervisorId',fetchFinalDocumentationsBySupervisor);
router.get('/fetch/forEvaluation',fetchForEvaluation);
router.get('/fetch/forApprovalLetter',fetchForApprovalLetter);
router.get('/fetch/assignedForEvaluation/:userId',fetchAssignedForEvaluation);
router.param('byStudentId',findByStudentId);
router.param('projectId',findByProjectId);
module.exports = router;