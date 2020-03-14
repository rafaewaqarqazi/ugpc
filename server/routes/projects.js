const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  findByStudentId,
  assignSupervisorAuto,
  findByProjectId,
  fetchFinalDocumentationsBySupervisor,
  changeFDStatus,
  fetchForEvaluation,
  scheduleInternalAuto,
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
  uploadPlagiarismReport,
  fetchSupervisors,
  assignSupervisorManual,
  fetchInternalExaminers,
  scheduleInternalManual,
  markMeetingSupervisorAsNotAttended
} = require('../controllers/projects');
const {requireSignin, isUGPCAuth, isChairmanOfficeAuth} = require('../controllers/auth');
const upload = require('../upload');

router.get('/by/studentId/:byStudentId', requireSignin, (req, res) => {
  res.json(req.project);
});
router.get('/by/projectId/:projectId', requireSignin, (req, res) => {
  res.json(req.project);
});
router.get('/all', requireSignin, getAllProjects);

//UGPC Member's Routes
router.put('/supervisor/assign/auto', requireSignin, isUGPCAuth, assignSupervisorAuto);
router.put('/supervisor/assign/manual', requireSignin, isUGPCAuth, assignSupervisorManual);
router.put('/supervisor/add/plagiarismReport/:type', requireSignin, upload.single('file'), uploadPlagiarismReport);
router.put('/changeFDStatus', requireSignin, changeFDStatus);
router.put('/schedule/internal/auto', requireSignin, isUGPCAuth, scheduleInternalAuto);
router.put('/schedule/internal/manual', requireSignin, isUGPCAuth, scheduleInternalManual);
router.put('/schedule/external/date', requireSignin, isUGPCAuth, scheduleExternalDate);
router.put('/evaluate/internalExternal', requireSignin, isUGPCAuth, evaluateInternalExternal);
router.get('/fetch/assignedForEvaluation/:userId', requireSignin, fetchAssignedForEvaluation);
router.get('/fetch/forEvaluation', requireSignin, fetchForEvaluation);
router.get('/fetch/supervisor', requireSignin, isUGPCAuth, fetchSupervisors);
router.get('/fetch/internalExaminers', requireSignin, isUGPCAuth, fetchInternalExaminers);

router.put('/assign/external/auto', requireSignin, isUGPCAuth, assignExternalAuto);
router.put('/assign/external/manual', requireSignin, isUGPCAuth, assignExternalManual);
router.get('/fetch/externalExaminers', requireSignin, isUGPCAuth, fetchExternalExaminers);
//Chairman Office
router.get('/fetch/forApprovalLetter', requireSignin, isChairmanOfficeAuth, fetchForApprovalLetter);
router.get('/fetch/completed', requireSignin, isChairmanOfficeAuth, fetchCompleted);
router.get('/fetch/forExternalLetter', requireSignin, isChairmanOfficeAuth, fetchForExternalLetter);


router.get('/fetch/finalDocumentation/by/supervisor/:supervisorId', requireSignin, fetchFinalDocumentationsBySupervisor);
router.put('/marks/supervisor', requireSignin, addMarksSupervisor);
router.put('/meetings/supervisor/schedule', requireSignin, scheduleMeetingSupervisor);
router.put('/meetings/supervisor/request', requireSignin, requestMeetingSupervisor);
router.put('/meetings/supervisor/attended', requireSignin, markMeetingSupervisorAsAttended);
router.put('/meetings/supervisor/notAttended', requireSignin, markMeetingSupervisorAsNotAttended);
router.param('byStudentId', findByStudentId);
router.param('projectId', findByProjectId);
module.exports = router;