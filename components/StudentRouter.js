import React, {useEffect} from 'react';
import {isAuthenticated,isAuthenticatedServer} from "../auth";
import router from "next/dist/client/router";
import nextCookie from "next-cookies";

const StudentRouter = (props) => {
    const redirectSignIn = ()=>{
        router.push('/sign-in')
    };
    const redirectStudentPanel = ()=>{
        router.push('/student-panel')
    };
    useEffect(()=>{
        if (props.role === 'Student'){
            redirectStudentPanel();
        }
        else{
            redirectSignIn();
        }
    },[]);


    return (
        <div>
            {props.children}
        </div>
    );
};
StudentRouter.getInitialProps = async ctx =>{
    if (typeof window !== 'undefined'){
        const role =await isAuthenticated() && isAuthenticated().user.role ==='Student';
        if (role){
            router.push('/student-panel');
        }else{
            router.push('/sign-in');
        }

    }
    else {
        const {token} = nextCookie(ctx);
        const data = await isAuthenticatedServer(token);
        const auth = await data.json();
        return {role:auth.role}
    }




};
export default StudentRouter;