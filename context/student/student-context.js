import React from "react";

export default React.createContext({
    user:{
        _id:'',
        name:'',
        email:'',
        role:'',
        isEmailVerified:false,
        student_details:{
            isEligible:false,
            department:'',
            batch:'',
            regNo:''
        }
    },
    setStudent: student =>{},
    updateStudent: student=>{},
    removeStudent: ()=>{}
})