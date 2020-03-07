import * as Actions from './ActionTypes';

//Action
export const addProjectAction = (project) => ({
  type: Actions.ADD_PROJECT,
  payload: project
});
export const projectLoadingAction = () => ({
  type: Actions.PROJECT_LOADING
});
export const addBacklogAction = (backlog) => ({
  type: Actions.ADD_BACKLOG,
  payload: {
    backlog
  }
});

export const addSprintAction = (sprint) => ({
  type: Actions.ADD_SPRINT,
  payload: {
    sprint
  }
});

export const addFinalDocumentationAction = (finalDocumentation) => ({
  type: Actions.ADD_FINAL_DOCUMENTATION,
  payload: finalDocumentation
});

export const addSupervisorMeetingAction = meetings => ({
  type: Actions.ADD_SUPERVISOR_MEETINGS,
  payload: meetings
});

export const editCommentAction = data => ({
  type: Actions.EDIT_COMMENT,
  payload: data
});
export const deleteCommentAction = data => ({
  type: Actions.DELETE_COMMENT,
  payload: data
});