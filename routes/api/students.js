const express = require('express');
const {createProject} = require("../../controllers/projects");
const {
    createProjectValidator,
    visionDocumentValidator
} = require("../../validator");
const {
    requireSignin,
    isStudent
} = require("../../controllers/auth");
const {userById} = require("../../controllers/users");
const {makeEligible, uploadAvatar} = require('../../controllers/students');
const upload = require('../../upload');
const router = express.Router();

router.put('/eligible/:userId',makeEligible);
router.post('/project/new',requireSignin,isStudent,createProjectValidator,createProject);
router.put("/project/vision-doc/:type/:id",upload.single('file'), uploadAvatar);

router.param("userId", userById);
module.exports = router;