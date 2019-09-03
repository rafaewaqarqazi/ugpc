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
}