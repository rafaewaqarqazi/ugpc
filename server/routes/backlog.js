const express = require('express');
const router = express.Router();
const {
  addNewTask,
  planSprint,
  changeTaskStatus,
  changeTaskPriority,
  completeSprint,
  removeTask,
  addAttachmentsToTask,
  removeAttachmentFromTask,
  addCommentToTask,
  removeTaskComment,
  changeTaskComment
} = require('../controllers/backlog');
const {requireSignin, isBacklogAuth} = require('../controllers/auth');
const upload = require('../upload');

router.put('/task/add', requireSignin, isBacklogAuth, addNewTask);
router.put('/task/add/attachments/:type', requireSignin, isBacklogAuth, upload.array('files'), addAttachmentsToTask);
router.put('/task/add/comment', requireSignin, isBacklogAuth, addCommentToTask);
router.put('/task/remove/comment', requireSignin, isBacklogAuth, removeTaskComment);
router.put('/task/remove', requireSignin, isBacklogAuth, removeTask);
router.put('/task/remove/attachment', requireSignin, isBacklogAuth, removeAttachmentFromTask);
router.put('/sprint/plan', requireSignin, isBacklogAuth, planSprint);
router.put('/task/change/comment', requireSignin, isBacklogAuth, changeTaskComment);
router.put('/task/change/column', requireSignin, isBacklogAuth, changeTaskStatus);
router.put('/task/change/priority', requireSignin, isBacklogAuth, changeTaskPriority);
router.put('/sprint/complete', requireSignin, isBacklogAuth, completeSprint);
module.exports = router;