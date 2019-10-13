import React, {useReducer, useEffect} from 'react';
import ProjectContext from './project-context';
import {projectReducer} from "./projectReducer";
import {
    addProjectAction,
    projectLoadingAction,
    addBacklogAction,
    addSprintAction,
    addFinalDocumentationAction
} from "./ActionCreators";
import {
    addTaskToBacklogAPI,
    changeColumnAPI,
    changePriorityDnDAPI,
    createProjectAPI,
    fetchProjectByStudentIdAPI,
    uploadVisionAPI,
    planSprintAPI,
    fetchProjectByProjectIdAPI,
    completeSprintAPI,
    uploadFinalDocumentationAPI,
    removeTaskAPI
} from "../../utils/apiCalls/students";
import {addAttachmentsToTaskAPI} from "../../utils/apiCalls/projects";

const ProjectState = (props) => {
    const [state, dispatch] = useReducer(projectReducer,{
        isLoading:true,
        errMess:null,
        project:{}
    });
    const fetchByStudentId =async ()=>{
        dispatch(projectLoadingAction());
        const project = await fetchProjectByStudentIdAPI();
        dispatch(addProjectAction(await project));
    };
    const createProject =async (data) =>{
        const project = await createProjectAPI(data);
        dispatch(addProjectAction(await project));
    };
    const uploadVision =async (data,projectId) => {
        return await uploadVisionAPI(data,projectId);
    };
    const addTaskToBacklog = async (projectId,task)=>{
        const result =  await addTaskToBacklogAPI(projectId,task);
        await dispatch(addBacklogAction(result.details.backlog))
    };
    const planSprint = async (data) =>{
        const result = await planSprintAPI(data);
        await dispatch(addBacklogAction(result.details.backlog))
    };
    const changeColumn = async (data)=>{
        const result = await changeColumnAPI(data);
        await dispatch(addSprintAction(result.details.sprint))
    };
    const changePriorityDnD = async (data)=>{
        const result = await changePriorityDnDAPI(data);
        await dispatch(addBacklogAction(result.details.backlog))
    };
    const fetchByProjectId = async projectId=>{
        dispatch(projectLoadingAction());
        const project = await fetchProjectByProjectIdAPI(projectId);
        dispatch(addProjectAction(await project));
    };
    const completeSprint = async data =>{
        const result = await completeSprintAPI(data);
       await dispatch(addSprintAction(result.details.sprint))
    };
    const uploadFinalDocumentation = async (data) =>{
        uploadFinalDocumentationAPI(data).then(result =>{
            dispatch(addFinalDocumentationAction(result.documentation.finalDocumentation))
        });

    };
    const removeTask = async data =>{
        const result = await removeTaskAPI(data);
        await dispatch(addBacklogAction(result.details.backlog))
    };
    const addAttachmentsToTask = async data =>{
        const result = await addAttachmentsToTaskAPI(data);
        await dispatch(addBacklogAction(result.result.details.backlog));
        return await result
    };
useEffect(()=>{
    console.log('Project State:',state)
},[state]);
    return (
        <ProjectContext.Provider value={{
            project:state,
            fetchByStudentId,
            fetchByProjectId,
            createProject:createProject,
            uploadVision:uploadVision,
            addTaskToBacklog,
            planSprint,
            changeColumn,
            changePriorityDnD,
            completeSprint,
            uploadFinalDocumentation,
            removeTask,
            addAttachmentsToTask
        }}>
            {props.children}
        </ProjectContext.Provider>
    );
};

export default ProjectState;