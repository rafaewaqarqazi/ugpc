const express = require('express');
const {createProject} = require("../controllers/projects");
const {
    requireSignin,
    isStudent
} = require("../controllers/auth");
const {userById} = require("../controllers/users");
const {changeEligibility,
    uploadVisionDocument,
    getNotEnrolledStudents,
    fetchForProgramOffice,
    resubmitVisionDoc,
    uploadFinalDocumentation
} = require('../controllers/students');
const upload = require('../upload');
const router = express.Router();

//Program_Office
router.put('/eligibility/:userId',changeEligibility);
router.get('/fetch/programOffice',fetchForProgramOffice);

//Students
router.put('/additionalFile/vision-doc/:type',requireSignin,isStudent,upload.single('file'),resubmitVisionDoc);
router.post('/project/new',requireSignin,isStudent,createProject);
router.put("/project/vision-doc/:type/:id",requireSignin,isStudent,upload.single('file'), uploadVisionDocument);
router.put('/project/finalDocumentation/:type',requireSignin,isStudent,upload.single('file'),uploadFinalDocumentation);
router.get('/notEnrolled/:userId',requireSignin,isStudent,getNotEnrolledStudents);

router.param("userId", userById);
module.exports = router;