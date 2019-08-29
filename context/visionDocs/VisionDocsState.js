import React, {useReducer, useEffect} from 'react';
import VisionDocsContext from './visionDocs-context';
import {visionDocsReducer} from "./visionDocsReducer";
import {
    getDocsByCommittee,
    commentOnVision,
    changeStatusAction,
    scheduleVisionDefenceAction,
    submitAdditionFilesVisionDocAction,
} from "./ActionCreators";

const VisionDocsState = (props) => {
    const [state, dispatch] = useReducer(visionDocsReducer,{
        isLoading:true,
        errMess:null,
        visionDocs:[],
        meetings:[]
    });
    const fetchByCommittee =async ()=>{
         return await getDocsByCommittee(dispatch);
    };
    const comment = async comment =>{
        return await commentOnVision(comment,dispatch);
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
        }}>
            {props.children}
        </VisionDocsContext.Provider>
    );
};

export default VisionDocsState;