const express = require('express');
const router = express.Router();
const {
    addNewTask
} = require('../controllers/backlog');
const {requireSignin} = require('../controllers/auth');

router.put('/task/add',addNewTask)

module.exports = router;