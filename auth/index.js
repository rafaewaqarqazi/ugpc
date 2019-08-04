import fetch from 'isomorphic-unfetch';
import {serverUrl} from "../helpers/config";
export const signup = user =>{
    return  fetch(`${serverUrl}/auth/student/signup`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signin = user =>{
    return  fetch(`${serverUrl}/auth/signin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const authenticate = (jwt, next)=>{
    if (typeof window !== 'undefined'){
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
};

export const signout = ()=>{
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
    }
    return fetch(`${serverUrl}/auth/signout`,{
        method: "GET"
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));

};

export const isAuthenticated =()=>{
    if (typeof window == 'undefined'){
        return false
    }
    if (localStorage.getItem('jwt')){
        return JSON.parse(localStorage.getItem('jwt'))
    }
    else {
        return false;
    }
};

export const isAuthenticatedServer =async (token)=>{
   return await fetch(`${serverUrl}/auth/isAuthenticated`,{
        method:"GET",
        headers:{
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        }
    });
};
//
// export const forgotPassword = email => {
//     console.log("email: ", email);
//     return fetch(`/api/forgot-password`, {
//         method: "PUT",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email })
//     })
//         .then(response => {
//             console.log("forgot password response: ", response);
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };
//
// export const resetPassword = resetInfo => {
//     return fetch(`/api/reset-password`, {
//         method: "PUT",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(resetInfo)
//     })
//         .then(response => {
//             console.log("forgot password response: ", response);
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };