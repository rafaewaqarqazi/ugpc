const express = require('express');
const router = express.Router();
const {getAllProjects} = require('../controllers/projects');
const {requireSignin} = require('../controllers/auth');


router.get('/all',getAllProjects);

module.exports = router;