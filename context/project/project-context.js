import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    project:{},
    fetchByStudentId: id =>{},
    updateProject: project=>{},
    removeProject: ()=>{}
})