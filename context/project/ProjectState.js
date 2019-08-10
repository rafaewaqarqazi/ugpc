import React, {useReducer, useEffect} from 'react';
import ProjectContext from './project-context';
import {projectReducer} from "./projectReducer";
import {getProjectByStudentId, createProjectAction,uploadVisionAction} from "./ActionCreators";

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
useEffect(()=>{
    console.log('Project State:',state)
},[state])
    return (
        <ProjectContext.Provider value={{
            project:state,
            fetchByStudentId,
            createProject:createProject,
            uploadVision:uploadVision
        }}>
            {props.children}
        </ProjectContext.Provider>
    );
};

export default ProjectState;