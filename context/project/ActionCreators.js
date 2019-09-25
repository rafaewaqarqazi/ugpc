import * as Actions from './ActionTypes';

//Action
export const addProjectAction = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoadingAction = ()=>({
    type:Actions.PROJECT_LOADING
});
export const addBacklogAction = (projectId,backlog)=>({
    type:Actions.ADD_BACKLOG,
    payload:{
        projectId,
        backlog
    }
});

export const addSprintAction = (projectId,sprint) =>({
    type:Actions.ADD_SPRINT,
    payload:{
        projectId,
        sprint
    }
});

export const addFinalDocumentationAction= (finalDocumentation)=>({
    type:Actions.ADD_FINAL_DOCUMENTATION,
    payload: finalDocumentation
})