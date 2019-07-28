const express = require('express');
const {createProject} = require("../../controllers/projects");
const {createProjectValidator} = require("../../validator");
const {
    requireSignin,
    isStudent
} = require("../../controllers/auth");
const {userById} = require("../../controllers/users");
const {makeEligible} = require('../../controllers/students');
const router = express.Router();

router.put('/eligible/:userId',makeEligible);
router.post('/project/new',requireSignin,isStudent,createProjectValidator,createProject);
router.param("userId", userById);
module.exports = router;