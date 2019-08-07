import fetch from 'isomorphic-unfetch';
import {serverUrl} from "../../helpers/config";
import * as Actions from './ActionTypes';
export const fetchProjectByStudentId = async (dispatch,id)=>{
    dispatch(projectLoading());
    const res = await fetch(`${serverUrl}/projects/by/${id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json'
        }
    });
    const project = await res.json();
    console.log('Fetch:',project);
    dispatch(addProject(project));
};

export const addProject = (project)=>({
    type:Actions.ADD_PROJECT,
    payload:project
});
export const projectLoading = ()=>({
    type:Actions.PROJECT_LOADING
});