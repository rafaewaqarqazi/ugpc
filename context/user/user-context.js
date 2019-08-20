import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    user:{},
    users:[],
    createUser: user => {},
    fetchUserById: () =>{},
    removeUser: ()=>{},
})