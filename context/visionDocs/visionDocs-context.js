import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    visionDocs:{},
    fetchByCommittee: committee =>{},
    addComment:comment=>{},
    removeComment:comment=>{},
    updateDoc: project=>{},
    removeDoc: ()=>{},
})