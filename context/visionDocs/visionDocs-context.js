import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    visionDocs:[],
    fetchByCommittee: committee =>{},
    scheduleVisionDefence:data =>{},
    submitAdditionFilesVisionDoc:(formData,type) =>{},
    comment:comment=>{},
    changeStatus:status =>{},
    unComment:comment=>{},
    updateDoc: project=>{},
    removeDoc: ()=>{},
})