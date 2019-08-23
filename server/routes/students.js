const express = require('express');
const {createProject} = require("../controllers/projects");
const {
    createProjectValidator,
} = require("../validator");
const {
    requireSignin,
    isStudent
} = require("../controllers/auth");
const {userById} = require("../controllers/users");
const {changeEligibility,
    uploadVisionDocument,
    getNotEnrolledStudents,
    fetchForProgramOffice
} = require('../controllers/students');
const upload = require('../upload');
const router = express.Router();

router.put('/eligibility/:userId',changeEligibility);
router.get('/fetch/programOffice',fetchForProgramOffice)
router.post('/project/new',requireSignin,isStudent,createProjectValidator,createProject);
router.put("/project/vision-doc/:type/:id",upload.single('file'), uploadVisionDocument);
router.get('/notEnrolled/:userId',requireSignin,isStudent,getNotEnrolledStudents);

router.param("userId", userById);
module.exports = router;