import React from "react";

export default React.createContext({
    isLoading:true,
    errMess:null,
    user:{},
    fetchUserById: id =>{},
    removeUser: ()=>{},
})