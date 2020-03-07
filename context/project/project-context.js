import React from "react";

export default React.createContext({
  isLoading: true,
  errMess: null,
  project: {},
  createProject: data => {
  },
  fetchByStudentId: id => {
  },
  fetchByProjectId: projectId => {
  },
  addTaskToBacklog: (projectId, task) => {
  },
  planSprint: data => {
  },
  completeSprint: data => {
  },
  changeColumn: data => {
  },
  changePriorityDnD: data => {
  },
  updateProject: project => {
  },
  removeProject: () => {
  },
  uploadVision: (data, projectId) => {
  },
  removeTask: data => {
  },
  addAttachmentsToTask: data => {
  },
  removeAttachmentFromTask: data => {
  },
  addCommentToTask: commentDetails => {
  },
  requestSupervisorMeeting: requestMeetingData => {
  },
  scheduleSupervisorMeeting: meetingData => {
  },
  markSupervisorMeetingAsAttended: data => {
  },
  editComment: data => {},
  deleteComment: data => {},
  editCommentFromTask: commentDetails => {},
  deleteCommentFromTask: commentDetails => {}
})