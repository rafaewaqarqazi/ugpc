import fetch from 'isomorphic-unfetch';
import {serverUrl} from "../utils/config";
import cookie from 'js-cookie';
import Router from 'next/router'
import nextCookie from 'next-cookies';
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

export const authenticate = (data, next)=>{
    cookie.set('token',data,{expires: 7});
    next();
};

export const signout = ()=>{

    cookie.remove('token');
   router.push('/sign-in')
};

export const isAuthenticated =()=>{
    const data= cookie.get('token');
    if (data){
        return JSON.parse(data)
    }
    else {
        return false;
    }
};

export const isEligible =async (token)=>{
   return await fetch(`${serverUrl}/auth/isEligible`,{
        method:"GET",
        headers:{
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        }
    });
};

export const verifyEmail = data =>{
    return  fetch(`${serverUrl}/auth/verify-email`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const studentAuth = ctx => {
    const { token } = nextCookie(ctx);
    const user =token ? JSON.parse(token) : {};
    if (ctx.req && !token && user.role !== 'Student') {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }

    if (!token && user.role !== 'Student') {
        Router.push('/sign-in')
    }

    if (ctx.req && !token && !user.isEmailVerified) {
        ctx.res.writeHead(302, { Location: `/student/verify-email/${user._id}` });
        ctx.res.end();
        return
    }
    else if (user.isEmailVerified){
        Router.push(`/student/verify-email/${user._id}`)
    }

    return token
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