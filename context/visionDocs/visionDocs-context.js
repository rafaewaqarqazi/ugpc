import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    visionDocs:[],
    fetchByCommittee: committee =>{},
    scheduleVisionDefence:data =>{},
    submitAdditionFilesVisionDoc:(formData,type) =>{},
    addMarks:marks=>{},
    generateAcceptanceLetter:(projectId,regNo)=>{},
    assignSupervisorAuto:(projectId,title)=>{},
    comment:comment=>{},
    changeStatus:status =>{},
    unComment:comment=>{},
    updateDoc: project=>{},
    removeDoc: ()=>{},
})