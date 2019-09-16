import React, {useReducer, useEffect} from 'react';
import ProjectContext from './project-context';
import {projectReducer} from "./projectReducer";
import {
    getProjectByStudentId,
    createProjectAction,
    uploadVisionAction,
    addTaskToBacklogAction,
    planSprintAction,
    changeColumnAction
} from "./ActionCreators";

const ProjectState = (props) => {
    const [state, dispatch] = useReducer(projectReducer,{
        isLoading:true,
        errMess:null,
        project:{}
    });
    const fetchByStudentId =async ()=>{
         return await getProjectByStudentId(dispatch);
    };
    const createProject =async (data) =>{
       return await createProjectAction(dispatch,data);
    };
    const uploadVision =async (data,projectId) => {
        return await uploadVisionAction(data,projectId,dispatch)
    };
    const addTaskToBacklog = async (projectId,task)=>{
        return await addTaskToBacklogAction(projectId,task,dispatch)
    };
    const planSprint = async (data) =>{
        return await planSprintAction(data,dispatch);
    };
    const changeColumn = async (data)=>{
        return await changeColumnAction(data,dispatch)
    }
useEffect(()=>{
    console.log('Project State:',state)
},[state])
    return (
        <ProjectContext.Provider value={{
            project:state,
            fetchByStudentId,
            createProject:createProject,
            uploadVision:uploadVision,
            addTaskToBacklog,
            planSprint,
            changeColumn
        }}>
            {props.children}
        </ProjectContext.Provider>
    );
};

export default ProjectState;