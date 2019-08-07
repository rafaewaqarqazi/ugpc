import React, {useReducer, useEffect} from 'react';
import ProjectContext from './project-context';
import {projectReducer} from "./projectReducer";
import {fetchProjectByStudentId} from "./ActionCreators";

const ProjectState = (props) => {
    const [state, dispatch] = useReducer(projectReducer,{
        isLoading:true,
        errMess:null,
        project:{}
    });
    const fetchByStudentId =async (id)=>{
        console.log('fetch Called');
        await fetchProjectByStudentId(dispatch,id);
    };
useEffect(()=>{
    console.log('Project State:',state)
},[state])
    return (
        <ProjectContext.Provider value={{
            project:state,
            fetchByStudentId
        }}>
            {props.children}
        </ProjectContext.Provider>
    );
};

export default ProjectState;