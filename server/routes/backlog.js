const express = require('express');
const router = express.Router();
const {
    addNewTask,
    planSprint
} = require('../controllers/backlog');
const {requireSignin} = require('../controllers/auth');

router.put('/task/add',addNewTask)
router.put('/planSprint',planSprint)
module.exports = router;