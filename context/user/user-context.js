import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    user:{},
    users:[],
    createUser: user => {},
    fetchUserById: () =>{},
    distributeMarks:marks=>{},
    uploadProfileImage:image=>{},
    changeName:data=>{},
    changePassword:data=>{},
    addNewBatch:newBatch=>{},
    removeBatch:batch=>{},
    fetchAllUsers:()=>{},
    removeUser:(userId,type)=>{},
    fetchCommittees:()=>{},
    removeUserState:()=>{}
})