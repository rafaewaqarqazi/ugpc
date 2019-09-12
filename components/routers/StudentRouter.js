import React, {useState, useEffect,useContext} from 'react';
import PageLoading from "../loading/PageLoading";
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
    else if (pending){
        return (
            <PendingEligibility/>
        )
    }
    else if (notEligible) {
        return (
            <NotEligible/>
        )
    }
    else
    {
        if (context.project.isLoading){
            return (<LinearProgress/>)
        }
        else if (context.project.project.length === 0 && r.pathname !== '/student/project/create'){
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