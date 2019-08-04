import React, {useEffect, useState} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/dist/client/router";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import {LinearProgress, makeStyles} from '@material-ui/core'
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
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
const LandingRouter = props =>{
    const classes = useStyles();

    const[loading,setLoading] = useState(true);
    useEffect(()=>{
        const student = isAuthenticated() && isAuthenticated().user.role ==='Student';
        const supervisor = isAuthenticated() && isAuthenticated().user.role ==='Supervisor';
        const chairman = isAuthenticated() && isAuthenticated().user.role ==='Chairman';
        const coordinator = isAuthenticated() && isAuthenticated().user.role ==='Coordinator';
        console.log(student);
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
            <div className={classes.root}>
                <LinearProgress color='secondary' />
            </div>

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