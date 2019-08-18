import React, {useReducer, useEffect} from 'react';
import UserContext from './user-context';
import {userReducer} from "./userReducer";
import {getUserById, createNewUser} from "./ActionCreators";


const UserState = (props) => {
    const [state, dispatch] = useReducer(userReducer,{
        isLoading:true,
        errMess:null,
        user:{},
        users:[]
    });
    const fetchByUserId =async ()=>{
        return await getUserById(dispatch);
    };
    const createUser =async user=>{
        return await createNewUser(user,dispatch);
    };
    useEffect(()=>{
        console.log('User State:',state)
    },[state]);
    return (
        <UserContext.Provider value={{
            user:state,
            fetchByUserId,
            createUser
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;