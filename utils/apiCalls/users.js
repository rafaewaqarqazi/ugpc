import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchUserByIdAPI = async ()=>{
    const res = await fetch(`${serverUrl}/auth/${isAuthenticated().user._id}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json'
        }
    });
    return await res.json();
};

export const createNewUserAPI = async user=>{
    const res = await fetch(`${serverUrl}/auth/ugpc/signup`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(user)
    });
    return await res.json();
};
export const getChairmanName = async ()=>{
    const res = await fetch(`${serverUrl}/auth/fetch/chairmanName`,{
        method:'GET',
        headers:{
            Accept:'application/json',
        }
    });
    return await res.json();
};

export const changeFinalDocumentationStatusAPI = async data =>{
    const res = await fetch(`${serverUrl}/projects/changeFDStatus`,{
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
export const marksDistributionAPI = async marks =>{
    const res = await fetch(`${serverUrl}/users/chairman/settings/marksDistribution`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({marks,userId:isAuthenticated().user._id})
    });
    return await res.json();
};
export const uploadProfileImageAPI = async image =>{
    const res = await fetch(`${serverUrl}/users/profile/upload/images`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:image
    });
    return await res.json();
};

export const changeNameAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/change/name`,{
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
export const changePasswordAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/change/password`,{
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

export const addNewBatchAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/chairman/settings/batch/add`,{
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

export const removeBatchAPI = async batch =>{
    const res = await fetch(`${serverUrl}/users/chairman/settings/batch/remove`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify(batch)
    });
    return await res.json();
};

export const fetchAllUsersAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/fetchAll`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};
export const removeUserAPI = async userId=>{
    const res = await fetch(`${serverUrl}/users/remove/${userId}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const fetchCommitteesAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/fetchCommittees`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const fetchNotInCommitteeMembersAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/fetchNotInCommittee`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const addMemberToCommitteeAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/committee/addMember`,{
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

export const removeFromCommitteeDepartmentAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/committee/remove/department`,{
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
export const removeFromCommitteeAPI = async data =>{
    const res = await fetch(`${serverUrl}/users/committee/remove/committee`,{
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
export const fetchAllStudentsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/fetch/studentsBarData?committees[]=${isAuthenticated().user.ugpc_details.committees}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
}
export const fetchAllSupervisorsAPI = async ()=>{
    const res = await fetch(`${serverUrl}/users/fetch/supervisors`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

