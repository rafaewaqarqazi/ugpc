import React, {useState, useEffect} from 'react';
import {isAuthenticated} from "../../auth";
import router from "next/dist/client/router";
import StudentPanelLayout from "../Layouts/StudentPanelLayout";
import {LinearProgress, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const StudentRouter= props =>{
    const classes = useStyles();
    const[loading,setLoading] = useState(true);
   useEffect(()=>{
       if (typeof window !== 'undefined'){
           const role = isAuthenticated() && isAuthenticated().user.role ==='Student';
           if (!role){
               router.push('/sign-in');
           }
           else{
               setLoading(false)
           }
       }
   },[]);

    if (loading){
        return (
            <div className={classes.root}>
                <LinearProgress color='secondary' />
            </div>

        )
    }
    else
    {
        return (
            <StudentPanelLayout>
                {props.children}
            </StudentPanelLayout>
        )
    }
};
export default StudentRouter;