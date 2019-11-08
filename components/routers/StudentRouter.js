import React, {useContext} from 'react';

import PendingEligibility from "../eligible/PendingEligibility";
import NotEligible from "../eligible/NotEligible";
import ProjectContext from '../../context/project/project-context';
import NoProjectComponent from "../NoProjectComponent";
import {useRouter} from "next/router";
import UserContext from '../../context/user/user-context';
import {LinearProgress} from "@material-ui/core";
const StudentRouter= props =>{
    const r = useRouter();
    const context = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const pending = !userContext.user.isLoading ?
        userContext.user.user.role === 'Student'?
            userContext.user.user.student_details.isEligible === 'Pending'
            : false
        :false;
    const notEligible = !userContext.user.isLoading ?
        userContext.user.user.role === 'Student'?
            userContext.user.user.student_details.isEligible === 'Not Eligible'
            : false
        :false;

    if (userContext.user.isLoading){
        return (
            <LinearProgress/>
        )
    }
    else if (pending && r.pathname !== '/student/profile'){
        return (
            <PendingEligibility/>
        )
    }
    else if (notEligible && r.pathname !== '/student/profile') {
        return (
            <NotEligible/>
        )
    }
    else
    {
        if (context.project.isLoading){
            return (<LinearProgress/>)
        }
        else if (!context.project.project && r.pathname !== '/student/project/create' && r.pathname !== '/student/profile'){
            return (
                <NoProjectComponent/>
            )
        }else{
            return (
                <div>
                    {props.children}
                </div>
            )
        }
    }
};
export default StudentRouter;