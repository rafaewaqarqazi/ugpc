import React, {useReducer, useEffect} from 'react';
import ProjectContext from './project-context';
import {projectReducer} from "./projectReducer";
import {
    addProjectAction,
    projectLoadingAction,
    addBacklogAction,
    addSprintAction,
    addFinalDocumentationAction,
    addSupervisorMeetingAction
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
    removeTaskAPI,
    removeAttachmentFromTaskAPI,

} from "../../utils/apiCalls/students";
import {addAttachmentsToTaskAPI,addCommentToTaskAPI,scheduleSupervisorMeetingAPI,requestSupervisorMeetingAPI,markSupervisorMeetingAsAttendedAPI} from "../../utils/apiCalls/projects";

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
        return await project;
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
    const addAttachmentsToTask = async (data,taskIn) =>{
        const result = await addAttachmentsToTaskAPI(data);
        if (taskIn === 'Backlog'){
            await dispatch(addBacklogAction(result.result.details.backlog));
        }else if (taskIn === 'ScrumBoard'){
            await dispatch(addSprintAction(result.result.details.sprint))
        }

        return await result
    };
    const removeAttachmentFromTask = async  (data) =>{
        const result = await removeAttachmentFromTaskAPI(data);
        if (data.taskIn === 'Backlog'){
            await dispatch(addBacklogAction(result.details.backlog));
        }else if (data.taskIn === 'ScrumBoard'){
            await dispatch(addSprintAction(result.details.sprint))
        }
        return await result
    };
    const addCommentToTask = async commentDetails =>{
        const result = await addCommentToTaskAPI(commentDetails);
        if (commentDetails.taskIn === 'Backlog'){
            await dispatch(addBacklogAction(result.details.backlog));
        }else if (commentDetails.taskIn === 'ScrumBoard'){
            await dispatch(addSprintAction(result.details.sprint))
        }
        return await result
    };
    const scheduleSupervisorMeeting = async meetingData =>{
        const result = await scheduleSupervisorMeetingAPI(meetingData);
        await dispatch(addSupervisorMeetingAction(result));
        return await result;
    };
    const requestSupervisorMeeting = async requestMeetingData =>{
        const result = await requestSupervisorMeetingAPI(requestMeetingData);
        return await result;
    };
    const markSupervisorMeetingAsAttended = async data =>{
        const result = await markSupervisorMeetingAsAttendedAPI(data);
        await dispatch(addSupervisorMeetingAction(result));
        return await result;
    }
useEffect(()=>{
    console.log('Project State:',state)
},[state]);
    return (
        <ProjectContext.Provider value={{
            project:state,
            fetchByStudentId,
            fetchByProjectId,
            createProject,
            uploadVision,
            addTaskToBacklog,
            planSprint,
            changeColumn,
            changePriorityDnD,
            completeSprint,
            uploadFinalDocumentation,
            removeTask,
            addAttachmentsToTask,
            removeAttachmentFromTask,
            addCommentToTask,
            scheduleSupervisorMeeting,
            requestSupervisorMeeting,
            markSupervisorMeetingAsAttended
        }}>
            {props.children}
        </ProjectContext.Provider>
    );
};

export default ProjectState;