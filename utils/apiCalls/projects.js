import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const assignSupervisorAutoAPI = async (projectId,title,regNo) =>{
    const res = await fetch(`${serverUrl}/projects/supervisor/assign`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({projectId,title,regNo})
    });
    return await res.json();
};

export const generateAcceptanceLetterAPI = async (projectId,regNo)=>{
    const res = await fetch(`${serverUrl}/projects/generate/acceptanceLetter`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({projectId,regNo})
    });
    return await res.json();
};
export const fetchFinalDocumentationsBySupervisorAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/finalDocumentation/by/supervisor/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const fetchForEvaluationProjectsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/forEvaluation?committees=${isAuthenticated().user.ugpc_details.committees}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const scheduleInternalAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/schedule/internal`,{
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
export const assignExternalAutoAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/assign/external/auto`,{
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
export const assignExternalManualAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/assign/external/manual`,{
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
export const scheduleExternalDateAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/schedule/external/date`,{
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
export const fetchExternalExaminersAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/externalExaminers`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const fetchAssignedForEvaluationProjects = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/assignedForEvaluation/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const evaluateInternalExternalAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/evaluate/internalExternal`,{
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
export const evaluateExternalAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/evaluate/external`,{
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
export const fetchForApprovalLetterAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/forApprovalLetter`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const fetchForExternalLetterAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/forExternalLetter`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const fetchCompletedProjectsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/completed`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const fetchExaminersAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/fetch/externalExaminers`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const fetchAllProjectsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/projects/all`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const addAttachmentsToTaskAPI = async data =>{
    const res = await fetch(`${serverUrl}/backlog/task/add/attachments/images`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:data
    });
    return await res.json();
};
export const fetchMarksDistributionAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/chairman/settings/fetch/marksDistribution`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};