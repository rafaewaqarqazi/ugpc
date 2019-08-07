import React, {useState, useEffect,useContext} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/router";
import PageLoading from "../loading/PageLoading";
import PendingEligibility from "../eligible/PendingEligibility";
import NotEligible from "../eligible/NotEligible";
import ProjectContext from '../../context/project/project-context';
import NoProjectComponent from "../NoProjectComponent";
import {useRouter} from "next/router";

const StudentRouter= props =>{
    const r = useRouter();
    const context = useContext(ProjectContext);
    const[loading,setLoading] = useState(true);
    const[pending, setPending] = useState(false);
    const [notEligible, setNotEligible] = useState(false);
   useEffect(()=>{
       if (typeof window !== 'undefined'){
           const role = isAuthenticated() && isAuthenticated().user.role ==='Student';
           const verified = isAuthenticated() && isAuthenticated().user.role ==='Student' && isAuthenticated().user.isEmailVerified;
           const pend = isAuthenticated() && isAuthenticated().user.role ==='Student' && isAuthenticated().user.student_details.isEligible === 'Pending';
           const notElg = isAuthenticated() && isAuthenticated().user.role ==='Student' && isAuthenticated().user.student_details.isEligible === 'Not Eligible';
           if (!role){
               router.push('/sign-in');
           }
           else if (!verified){
               router.push(`/student/verify-email/${isAuthenticated().user._id}`);
           }
           else if (pend){
               setLoading(false);
               setPending(true);
           }
           else if (notElg){
               setLoading(false);
               setNotEligible(true);
           }
           else{

               context.fetchByStudentId(isAuthenticated().user._id)


               setLoading(false)
           }
       }
   },[]);

    if (loading){
        return (
            <PageLoading/>
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
            return (<PageLoading/>)
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