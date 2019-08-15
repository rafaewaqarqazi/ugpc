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