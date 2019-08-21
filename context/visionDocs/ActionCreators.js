import * as Actions from './ActionTypes';
import {fetchDocsByCommitteeAPI,commentOnVisionAPI,changeStatusAPI} from "../../utils/apiCalls/visionDocs";

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
    dispatch(docsLoading());
    const docs = await fetchDocsByCommitteeAPI();
    dispatch(addDocs(docs));
    return await res;
}
//Action Dispatchers
export const addDocs = (project)=>({
    type:Actions.ADD_DOCS,
    payload:project
});
export const docsLoading = ()=>({
    type:Actions.DOCS_LOADING
});