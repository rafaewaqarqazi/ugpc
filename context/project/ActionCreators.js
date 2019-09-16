import * as Actions from './ActionTypes';
import {
    fetchProjectByStudentIdAPI,
    createProjectAPI,
    uploadVisionAPI,
    addTaskToBacklogAPI,
    planSprintAPI,
    changeColumnAPI
} from "../../utils/apiCalls/students";

//Fetchers

export const getProjectByStudentId = async (dispatch)=>{
    dispatch(projectLoading());
    const project = await fetchProjectByStudentIdAPI();
    dispatch(addProject(project));
};
export const createProjectAction = async (dispatch,data)=>{
    const project = await createProjectAPI(data);
    dispatch(addProject(await project));
};

//Upload Vision Document
export const uploadVisionAction=async (data,projectId,dispatch)=>{
    return await uploadVisionAPI(data,projectId);
}


//Backlog

export const addTaskToBacklogAction = async (projectId,task,dispatch) =>{
    const result =  await addTaskToBacklogAPI(projectId,task);
    await dispatch(addBacklogAndSprint(projectId,result.details))
};
export const planSprintAction = async (data,dispatch) =>{
    const result = await planSprintAPI(data);
    await dispatch(addBacklogAndSprint(data.projectId,result.details))
};

export const changeColumnAction = async (data,dispatch) =>{
    const result = await changeColumnAPI(data);
    return await dispatch(addBacklogAndSprint(data.projectId,result.details))
}
//Action Dispatchers
export const addProject = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoading = ()=>({
    type:Actions.PROJECT_LOADING
});
const addBacklogAndSprint = (projectId,details)=>({
    type:Actions.ADD_BACKLOG_ANDSPRINT,
    payload:{
        projectId,
        details
    }
})