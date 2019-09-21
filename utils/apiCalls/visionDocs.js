import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchDocsByCommitteeAPI = async ()=>{
    console.log(isAuthenticated().user.ugpc_details.committees)
    const res = await fetch(`${serverUrl}/visionDocument/fetch/byCommittees?committees[]=${isAuthenticated().user.ugpc_details.committees}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
    });
    return await res.json();
};
export const fetchBySupervisorAPI = async ()=>{
    const res = await fetch(`${serverUrl}/visionDocument/fetch/bySupervisor/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
    });
    return await res.json();
}
export const commentOnVisionAPI = async comment =>{
    const res = await fetch(`${serverUrl}/visionDocument/comment`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(comment)
    });
    return await res.json();
}

export const changeStatusAPI = async status =>{
    const res = await fetch(`${serverUrl}/visionDocument/changeStatus`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(status)
    });
    return await res.json();
};

export const scheduleVisionDefenceAPI = async data =>{
    const res = await fetch(`${serverUrl}/visionDocument/scheduleDefence`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(data)
    });
    return await res.json();
};

export const submitAdditionFilesVisionDocAPI = async (formData,type) =>{
    const res = await fetch(`${serverUrl}/students/additionalFile/vision-doc/${type}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:formData
    });
    return await res.json();
}

export const fetchMeetingsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/visionDocument/fetch/byMeetings?committees[]=${isAuthenticated().user.ugpc_details.committees}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
    });
    return await res.json();
};

export const addMarksAPI = async (marks,projectId) =>{
    const res = await fetch(`${serverUrl}/visionDocument/addMarks`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({
            marks,
            projectId
        })
    });
    return await res.json();
}


