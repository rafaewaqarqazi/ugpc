import React, {useEffect, useState} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/dist/client/router";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import PageLoading from "../loading/PageLoading";


const redirectStudent = ()=>{
    router.push('/student/overview')
};
const redirectSupervisor = ()=>{
    router.push('/supervisor');
};
const redirectChairman = ()=>{
    router.push('/chairman');
};
const redirectCoordinator = ()=>{
    router.push('/coordinator');
};

const LandingRouter = props =>{
    const[loading,setLoading] = useState(true);
    useEffect(()=>{
        const student = isAuthenticated() && isAuthenticated().user.role ==='Student';
        const supervisor = isAuthenticated() && isAuthenticated().user.role ==='Supervisor';
        const chairman = isAuthenticated() && isAuthenticated().user.role ==='Chairman';
        const coordinator = isAuthenticated() && isAuthenticated().user.role ==='Coordinator';
        if (student){
            redirectStudent();
        } else if (supervisor){
            redirectSupervisor()
        }else if (chairman){
            redirectChairman()
        }else  if (coordinator){
            redirectCoordinator()
        } else{
            setLoading(false)
        }
    },[]);



    if (loading){
        return (
            <PageLoading/>
        )
    }
    else {
        return (
           <div>
                {props.children}
           </div>
        );
    }

};

export default LandingRouter;