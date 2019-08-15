import * as Actions from './ActionTypes';
import {fetchProjectByStudentIdAPI,createProjectAPI,uploadVisionAPI} from "../../utils/apiCalls/students";

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

//Action Dispatchers
export const addProject = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoading = ()=>({
    type:Actions.PROJECT_LOADING
});