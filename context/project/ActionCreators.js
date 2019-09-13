import * as Actions from './ActionTypes';
import {
    fetchProjectByStudentIdAPI,
    createProjectAPI,
    uploadVisionAPI,
    addTaskToBacklogAPI
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
    await dispatch(addBacklog(projectId,result.details.backlog))
}
//Action Dispatchers
export const addProject = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoading = ()=>({
    type:Actions.PROJECT_LOADING
});
const addBacklog = (projectId,backlog)=>({
    type:Actions.ADD_BACKLOG,
    payload:{
        projectId,
        backlog
    }
})