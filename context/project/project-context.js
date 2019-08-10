import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    project:{},
    createProject: data =>{},
    fetchByStudentId: id =>{},
    updateProject: project=>{},
    removeProject: ()=>{},
    uploadVision:(data,projectId)=>{}
})