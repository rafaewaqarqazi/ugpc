import fetch from 'isomorphic-unfetch';
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {Typography} from "@material-ui/core";
import {isAuthenticated,isAuthenticatedServer} from "../auth";
import router from 'next/router';
import nextCookie from 'next-cookies';
import {serverUrl} from "../helpers/config";
import {useEffect} from 'react';


const Index = ({role}) => {
    useEffect(()=>{
        if (role === 'Student'){
            router.push('/student-panel')
        }
    },[]);


    return (
        <LandingPageLayout>

        </LandingPageLayout>
    );
};
Index.getInitialProps = async ctx =>{
    if (typeof window !== 'undefined'){
        const role =await isAuthenticated() && isAuthenticated().user.role ==='Student';
        console.log(role);
        if (role){
            router.push('/student-panel');
        }
        else{
            return {role:''}
        }
    }
    else {
        const {token} = nextCookie(ctx);
        console.log(token);
       const data = await isAuthenticatedServer(token);
        const auth = await data.json();
        return {role:auth.role}
    }




};

export default Index;