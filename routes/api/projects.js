const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    createProject
} = require('../../controllers/projects');
const {requireSignin, isStudent} = require('../../controllers/auth');

const {createProjectValidator} = require('../../validator');

router.get('/all',getAllProjects);
router.post('/new-project',requireSignin,isStudent,createProjectValidator,createProject);
module.exports = router;