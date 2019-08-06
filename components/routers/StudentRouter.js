import React, {useState, useEffect} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/dist/client/router";
import StudentPanelLayout from "../Layouts/StudentPanelLayout";
import PageLoading from "../loading/PageLoading";
import PendingEligibility from "../eligible/PendingEligibility";
import NotEligible from "../eligible/NotEligible";


const StudentRouter= props =>{
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
        return (
            <div>
                {props.children}
            </div>
        )
    }
};
export default StudentRouter;