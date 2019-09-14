import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchNotEnrolledStudents = async()=>{
    const res = await fetch(`${serverUrl}/students/notEnrolled/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const createProjectAPI = async (data)=>{
    const res = await fetch(`${serverUrl}/students/project/new`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(data)
    });
    return await res.json();
};

export const fetchProjectByStudentIdAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/by/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const uploadVisionAPI = async (data,projectId )=>{
    const res = await fetch(`${serverUrl}/students/project/vision-doc/pdf/${projectId}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:data
    });
    return await res.json();
};
export const addTaskToBacklogAPI = async (projectId,task)=>{
    const res = await fetch(`${serverUrl}/backlog/task/add`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({projectId,task})
    });
    return await res.json();
};

export const planSprintAPI = async data =>{
    const res = await fetch(`${serverUrl}/backlog/planSprint`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(data)
    });
    return await res.json();
}
