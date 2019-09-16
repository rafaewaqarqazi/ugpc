const express = require('express');
const router = express.Router();
const {
    addNewTask,
    planSprint,
    changeTaskStatus
} = require('../controllers/backlog');
const {requireSignin} = require('../controllers/auth');

router.put('/task/add',addNewTask);
router.put('/planSprint',planSprint);
router.put('/task/change/column',changeTaskStatus);
module.exports = router;