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
