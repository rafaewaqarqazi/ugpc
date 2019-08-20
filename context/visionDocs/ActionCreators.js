import * as Actions from './ActionTypes';
import {fetchDocsByCommitteeAPI} from "../../utils/apiCalls/visionDocs";

//Fetchers

export const getDocsByCommittee = async (dispatch)=>{
    dispatch(docsLoading());
    const docs = await fetchDocsByCommitteeAPI();
    dispatch(addDocs(docs));
};

//Action Dispatchers
export const addDocs = (project)=>({
    type:Actions.ADD_DOCS,
    payload:project
});
export const docsLoading = ()=>({
    type:Actions.DOCS_LOADING
});