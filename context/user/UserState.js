import React, {useReducer, useEffect} from 'react';
import UserContext from './user-context';
import {userReducer} from "./userReducer";
import {getUserById} from "./ActionCreators";


const UserState = (props) => {
    const [state, dispatch] = useReducer(userReducer,{
        isLoading:true,
        errMess:null,
        user:{}
    });
    const fetchByUserId =async ()=>{
        return await getUserById(dispatch);
    };
    useEffect(()=>{
        console.log('User State:',state)
    },[state]);
    return (
        <UserContext.Provider value={{
            user:state,
            fetchByUserId
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;