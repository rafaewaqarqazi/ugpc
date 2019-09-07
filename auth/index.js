import fetch from 'isomorphic-unfetch';
import {serverUrl} from "../utils/config";
import cookie from 'js-cookie';
import Router from 'next/router'
import nextCookie from 'next-cookies';
import router from "next/dist/client/router";

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

export const authenticate = (data)=>{
    cookie.set('token',data,{expires: 7});
    Router.push('/')
};

export const signout = ()=>{
    cookie.remove('token');
   Router.push('/sign-in')
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
    const user =token ? JSON.parse(token) : {user:{role:''}};

    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role !== 'Student'){
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && !user.user.isEmailVerified) {
        ctx.res.writeHead(302, { Location: `/student/verify-email/${user.user._id}` });
        ctx.res.end();
        return
    }

    if (!token){
        Router.push('/sign-in')
    }
    else if (token &&  user.user.role !== 'Student') {
        Router.push('/sign-in')
    } else if (!user.user.isEmailVerified && typeof window !== 'undefined'){
        Router.push(`/student/verify-email?id=${user.user._id}`, `/student/verify-email/${user.user._id}`)
    }
    return token



};
export const ugpcMemberAuth = (ctx, userRole) =>{
    const { token } = nextCookie(ctx);
    const user =token ? JSON.parse(token) : {user:{role:'',ugpc_details: {position: ''}}};
    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role !== 'UGPC_Member'){
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position !== userRole){
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }

    if (!token){
        Router.push('/sign-in')
    }
    else if (token &&  user.user.role !== 'UGPC_Member') {
        Router.push('/sign-in')
    }
    else if (token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position !== userRole){
        Router.push('/sign-in')
    }
    return token
}

export const chairmanAuth = ctx => {
    const { token } = nextCookie(ctx);
    const user =token ? JSON.parse(token) : {user:{role:''}};

    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role !== 'Chairman DCSSE'){
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }

    if (!token){
        Router.push('/sign-in')
    }
    else if (token &&  user.user.role !== 'Chairman DCSSE') {
        Router.push('/sign-in')
    }
    return token
};
export const programOfficeAuth = ctx => {
    const { token } = nextCookie(ctx);
    const user =token ? JSON.parse(token) : {user:{role:''}};

    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role !== 'Program_Office'){
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
        return
    }

    if (!token){
        Router.push('/sign-in')
    }
    else if (token &&  user.user.role !== 'Program_Office') {
        Router.push('/sign-in')
    }
    return token
};

export const landingAuth = ctx => {
    const { token } = nextCookie(ctx);
    const user =token ? JSON.parse(token) : {user:{role:'',ugpc_details:{position:'',committee:''}}};
    if (ctx.req && token && user.user.role === 'Student') {
        ctx.res.writeHead(302, { Location: '/student/roadmap' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position === 'Member') {
        ctx.res.writeHead(302, { Location: '/UGPC_Member/overview' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position === 'Coordinator') {
        ctx.res.writeHead(302, { Location: `/coordinator/overview` });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'Chairman DCSSE') {
        ctx.res.writeHead(302, { Location: '/chairman/overview' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'Supervisor') {
        ctx.res.writeHead(302, { Location: '/supervisor/overview' });
        ctx.res.end();
        return
    }
    else if (ctx.req && token && user.user.role === 'Program_Office') {
        ctx.res.writeHead(302, { Location: '/program-office' });
        ctx.res.end();
        return
    }
    if (token && user.user.role === 'Student') {
        Router.push('/student/roadmap')
    }
    else if (token && user.user.role === 'Supervisor') {
        Router.push('/supervisor/overview')
    }
    else if (token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position === 'Member') {
        Router.push('/UGPC_Member/overview')
    }
    else if (token && user.user.role === 'UGPC_Member' && user.user.ugpc_details.position === 'Coordinator') {
        Router.push(`/coordinator/overview`)
    }
    else if (token && user.user.role === 'Chairman DCSSE') {
        Router.push('/chairman/overview')
    }
    else if (token && user.user.role === 'Program_Office') {
        Router.push('/program-office')
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