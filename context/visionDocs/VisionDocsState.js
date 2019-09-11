import React, {useReducer, useEffect} from 'react';
import VisionDocsContext from './visionDocs-context';
import {visionDocsReducer} from "./visionDocsReducer";
import {
    getDocsByCommittee,
    commentOnVision,
    changeStatusAction,
    scheduleVisionDefenceAction,
    submitAdditionFilesVisionDocAction,
    addMarksAction
} from "./ActionCreators";

const VisionDocsState = (props) => {
    const [state, dispatch] = useReducer(visionDocsReducer,{
        isLoading:true,
        errMess:null,
        visionDocs:[]
    });
    const fetchByCommittee =async ()=>{
         return await getDocsByCommittee(dispatch);
    };
    const comment = async comment =>{
        return await commentOnVision(comment);
    }
    const changeStatus = async status =>{
        return await changeStatusAction(status,dispatch);
    };
    const scheduleVisionDefence = async data =>{

        return await scheduleVisionDefenceAction(data,dispatch);
    };
    const submitAdditionFilesVisionDoc = async (formData,type) =>{
        return await submitAdditionFilesVisionDocAction(formData,type,dispatch);
    };
    const addMarks = async (marks,projectId) =>{
        return await addMarksAction(marks,projectId,dispatch);
    }
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
            addMarks
        }}>
            {props.children}
        </VisionDocsContext.Provider>
    );
};

export default VisionDocsState;