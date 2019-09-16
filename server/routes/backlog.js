const express = require('express');
const router = express.Router();
const {
    addNewTask,
    planSprint,
    changeTaskStatus,
    changeTaskPriority
} = require('../controllers/backlog');
const {requireSignin} = require('../controllers/auth');

router.put('/task/add',addNewTask);
router.put('/planSprint',planSprint);
router.put('/task/change/column',changeTaskStatus);
router.put('/task/change/priority',changeTaskPriority);
module.exports = router;