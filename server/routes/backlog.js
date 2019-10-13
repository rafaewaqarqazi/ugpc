const express = require('express');
const router = express.Router();
const {
    addNewTask,
    planSprint,
    changeTaskStatus,
    changeTaskPriority,
    completeSprint,
    removeTask,
    addAttachmentsToTask
} = require('../controllers/backlog');
const {requireSignin} = require('../controllers/auth');
const upload = require('../upload');

router.put('/task/add',addNewTask);
router.put('/task/add/attachments/:type', upload.array('files'),addAttachmentsToTask);
router.put('/task/remove',removeTask);
router.put('/sprint/plan',planSprint);
router.put('/task/change/column',changeTaskStatus);
router.put('/task/change/priority',changeTaskPriority);
router.put('/sprint/complete',completeSprint)
module.exports = router;