import * as Actions from './ActionTypes';
import {fetchProjectByStudentId,createProjectAPI} from "../../helpers/apiCalls/students";

//Fetchers

export const getProjectByStudentId = async (dispatch)=>{
    dispatch(projectLoading());
    const project = await fetchProjectByStudentId();
    dispatch(addProject(project));
};
export const createProjectAction = async (dispatch,data)=>{
    const project = await createProjectAPI(data);
    dispatch(addProject(await project));
};

//Action Dispatchers
export const addProject = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoading = ()=>({
    type:Actions.PROJECT_LOADING
});