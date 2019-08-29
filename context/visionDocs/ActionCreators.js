import * as Actions from './ActionTypes';
import {
    fetchDocsByCommitteeAPI,
    commentOnVisionAPI,
    changeStatusAPI,
    scheduleVisionDefenceAPI,
    submitAdditionFilesVisionDocAPI,
} from "../../utils/apiCalls/visionDocs";


//Fetchers

export const getDocsByCommittee = async (dispatch)=>{
    dispatch(docsLoading());
    const docs = await fetchDocsByCommitteeAPI();
    dispatch(addDocs(docs));
};

export const commentOnVision = async (comment,dispatch)=>{
    return await commentOnVisionAPI(comment);
}
export const changeStatusAction = async (status,dispatch)=>{
    const res =await changeStatusAPI(status);
   await getDocsByCommittee(dispatch);
    return await res;
}

export const submitAdditionFilesVisionDocAction = async (formData,type,dispatch)=>{
    return  await submitAdditionFilesVisionDocAPI(formData,type);
}
export const scheduleVisionDefenceAction = async (data,dispatch)=>{
    const res =await scheduleVisionDefenceAPI(data);
    return await res;
};

//Action Dispatchers
export const addDocs = (project)=>({
    type:Actions.ADD_DOCS,
    payload:project
});
export const docsLoading = ()=>({
    type:Actions.DOCS_LOADING
});