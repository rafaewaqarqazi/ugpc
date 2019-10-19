import React, {useReducer, useEffect} from 'react';
import VisionDocsContext from './visionDocs-context';
import {visionDocsReducer} from "./visionDocsReducer";
import {
    docsLoadingAction, addDocsAction, docsFailedAction
} from "./ActionCreators";
import {assignSupervisorAutoAPI, generateAcceptanceLetterAPI} from "../../utils/apiCalls/projects";
import {
    addMarksAPI,
    changeStatusAPI,
    commentOnVisionAPI,
    fetchBySupervisorAPI, fetchDocsByCommitteeAPI, scheduleVisionDefenceAPI,
    submitAdditionFilesVisionDocAPI
} from "../../utils/apiCalls/visionDocs";

const VisionDocsState = (props) => {
    const [state, dispatch] = useReducer(visionDocsReducer,{
        isLoading:true,
        errMess:null,
        visionDocs:[]
    });
    const fetchByCommittee =async (loading)=>{
        try {
            if (loading){
                dispatch(docsLoadingAction());
            }
            const docs = await fetchDocsByCommitteeAPI();
            dispatch(addDocsAction(docs));
        }catch (e) {
            await dispatch(docsFailedAction('Failed to load Projects'))
        }
    };
    const comment = async comment =>{
        return await commentOnVisionAPI(comment);
    };
    const changeStatus = async status =>{
        const res =await changeStatusAPI(status);
        return await res;
    };
    const scheduleVisionDefence = async data =>{
        return await scheduleVisionDefenceAPI(data);
    };
    const submitAdditionFilesVisionDoc = async (formData,type) =>{
        return await submitAdditionFilesVisionDocAPI(formData,type);
    };
    const addMarks = async (marks,projectId) =>{
        return await addMarksAPI(marks,projectId);
    };
    const generateAcceptanceLetter = async (projectId,regNo) =>{
        const result = await generateAcceptanceLetterAPI(projectId,regNo);
        return await result;
    };
    const assignSupervisorAuto = async (projectId,title,regNo)=>{
        const result = await assignSupervisorAutoAPI(projectId,title,regNo);
        return await result
    };
    const fetchBySupervisor = async (loading)=>{
        try {
            if (loading){
                dispatch(docsLoadingAction());
            }
            const result = await fetchBySupervisorAPI();
            dispatch(addDocsAction(result));
        }catch (e) {
            await dispatch(docsFailedAction('Failed to load Documents'))
        }
    };
useEffect(()=>{
    console.log('Vision Docs State:',state)
},[state])
    return (
        <VisionDocsContext.Provider value={{
            visionDocs:state,
            fetchByCommittee,
            comment,
            changeStatus,
            scheduleVisionDefence,
            submitAdditionFilesVisionDoc,
            addMarks,
            generateAcceptanceLetter,
            assignSupervisorAuto,
            fetchBySupervisor
        }}>
            {props.children}
        </VisionDocsContext.Provider>
    );
};

export default VisionDocsState;