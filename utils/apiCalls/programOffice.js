import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchStudentsForEligibility = async()=>{
    const res = await fetch(`${serverUrl}/students/fetch/programOffice`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        }
    });
    return await res.json();
};

export const changeEligibility = async (status, id)=>{
    const res = await fetch(`${serverUrl}/students/eligibility/${id}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
        },
        body:JSON.stringify({status})
    });
    return await res.json();
}