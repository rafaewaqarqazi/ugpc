const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    findByStudentId,
    assignSupervisor,
    findByProjectId,
    fetchFinalDocumentationsBySupervisor,
    changeFDStatus,
    fetchForEvaluation,
    scheduleInternal,
    scheduleExternalDate,
    assignExternalAuto,
    assignExternalManual,
    fetchExternalExaminers,
    fetchAssignedForEvaluation,
    evaluateInternalExternal,
    fetchForApprovalLetter,
    fetchForExternalLetter,
    fetchCompleted,
    addMarksSupervisor,
    scheduleMeetingSupervisor,
    requestMeetingSupervisor,
    markMeetingSupervisorAsAttended,
    uploadPlagiarismReport
} = require('../controllers/projects');
const {requireSignin,isUGPCAuth, isChairmanOfficeAuth} = require('../controllers/auth');
const upload = require('../upload');

router.get('/by/studentId/:byStudentId',requireSignin,(req,res)=>{
    res.json(req.project);
});
router.get('/by/projectId/:projectId',requireSignin,(req,res)=>{
    res.json(req.project);
});
router.get('/all',requireSignin,getAllProjects);

//UGPC Member's Routes
router.put('/supervisor/assign',requireSignin,isUGPCAuth,assignSupervisor);
router.put('/supervisor/add/plagiarismReport/:type',requireSignin,upload.single('file'),uploadPlagiarismReport);
router.put('/changeFDStatus',requireSignin,changeFDStatus);
router.put('/schedule/internal',requireSignin,isUGPCAuth,scheduleInternal);
router.put('/schedule/external/date',requireSignin,isUGPCAuth,scheduleExternalDate);
router.put('/evaluate/internalExternal',requireSignin,isUGPCAuth,evaluateInternalExternal);
router.get('/fetch/assignedForEvaluation/:userId',requireSignin,fetchAssignedForEvaluation);
router.get('/fetch/forEvaluation',requireSignin,fetchForEvaluation);

//Chairman Office
router.put('/assign/external/auto',requireSignin,isChairmanOfficeAuth,assignExternalAuto);
router.put('/assign/external/manual',requireSignin,isChairmanOfficeAuth,assignExternalManual);
router.get('/fetch/externalExaminers',requireSignin,isChairmanOfficeAuth,fetchExternalExaminers);
router.get('/fetch/forApprovalLetter',requireSignin,isChairmanOfficeAuth,fetchForApprovalLetter);
router.get('/fetch/completed',requireSignin,isChairmanOfficeAuth,fetchCompleted);
router.get('/fetch/forExternalLetter',requireSignin,isChairmanOfficeAuth,fetchForExternalLetter);


router.get('/fetch/finalDocumentation/by/supervisor/:supervisorId',requireSignin,fetchFinalDocumentationsBySupervisor);
router.put('/marks/supervisor',requireSignin,addMarksSupervisor);
router.put('/meetings/supervisor/schedule',requireSignin,scheduleMeetingSupervisor);
router.put('/meetings/supervisor/request',requireSignin,requestMeetingSupervisor);
router.put('/meetings/supervisor/attended',requireSignin,markMeetingSupervisorAsAttended);
router.param('byStudentId',findByStudentId);
router.param('projectId',findByProjectId);
module.exports = router;