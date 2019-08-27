import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchDocsByCommitteeAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/${isAuthenticated().user.ugpc_details.committee}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const commentOnVisionAPI = async comment =>{
    const res = await fetch(`${serverUrl}/projects/visionDocument/comment`,{
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
    const res = await fetch(`${serverUrl}/projects/visionDocument/changeStatus`,{
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
    const res = await fetch(`${serverUrl}/projects/visionDocument/schedule/visionDefence`,{
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


