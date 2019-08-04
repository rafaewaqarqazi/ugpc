import React, {useEffect, useState} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/dist/client/router";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import {LinearProgress, Avatar, Container} from '@material-ui/core';
import {useStyles} from "../../src/material-styles/page-loading";

const redirectStudent = ()=>{
    router.push('/student')
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
    const classes = useStyles();

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
            <Container  component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                </div>
                <LinearProgress color='secondary' />
            </Container>

        )
    }
    else {
        return (
            <LandingPageLayout>
                {props.children}
            </LandingPageLayout>
        );
    }

};

export default LandingRouter;