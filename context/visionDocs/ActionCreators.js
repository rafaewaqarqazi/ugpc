import * as Actions from './ActionTypes';
import {
    fetchDocsByCommitteeAPI,
    commentOnVisionAPI,
    changeStatusAPI,
    scheduleVisionDefenceAPI,
    submitAdditionFilesVisionDocAPI,
    addMarksAPI,
} from "../../utils/apiCalls/visionDocs";


//Fetchers

export const getDocsByCommittee = async (dispatch)=>{
    dispatch(docsLoading());
    const docs = await fetchDocsByCommitteeAPI();
    dispatch(addDocs(docs));
};

export const commentOnVision = async (comment)=>{
    return await commentOnVisionAPI(comment);
}

export const assignSupervisorAction = (projectId,supervisor)=>({
    type:Actions.ADD_SUPERVISOR,
    payload:{
        projectId,supervisor
    }
})

export const submitAdditionFilesVisionDocAction = async (formData,type,dispatch)=>{
    return  await submitAdditionFilesVisionDocAPI(formData,type);
}
export const scheduleVisionDefenceAction = async (data,dispatch)=>{
    const res =await scheduleVisionDefenceAPI(data);
    return await res;
};
export const addMarksAction = async (marks,projectId,dispatch)=>{
    const res = await addMarksAPI(marks,projectId);
    dispatch(addMarks(marks,projectId))
    return await res;
};

export const generateAcceptanceLetterAction = (projectId,issueDate,regNo)=>({
    type:Actions.ADD_ACCEPTANCE_LETTER,
    payload:{
        projectId,
        issueDate,
        regNo
    }
})


//Action Dispatchers
export const addDocs = (project)=>({
    type:Actions.ADD_DOCS,
    payload:project
});
export const docsLoading = ()=>({
    type:Actions.DOCS_LOADING
});

export const addMarks = (marks,projectId) =>({
    type:Actions.ADD_MARKS,
    payload:{marks,projectId}
});

export const addComments = (comments) => ({})