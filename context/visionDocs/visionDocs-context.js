import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    visionDocs:{},
    fetchByCommittee: committee =>{},
    comment:comment=>{},
    changeStatus:status =>{},
    unComment:comment=>{},
    updateDoc: project=>{},
    removeDoc: ()=>{},
})