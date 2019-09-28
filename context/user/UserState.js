import React, {useReducer, useEffect} from 'react';
import UserContext from './user-context';
import {userReducer} from "./userReducer";
import {getUserById, createNewUser} from "./ActionCreators";
import {marksDistributionAPI} from '../../utils/apiCalls/users';

const UserState = (props) => {
    const [state, dispatch] = useReducer(userReducer,{
        isLoading:true,
        errMess:null,
        user:{},
        users:[]
    });
    const fetchUserById =async ()=>{
        return await getUserById(dispatch);
    };
    const createUser =async user=>{
        return await createNewUser(user,dispatch);
    };
    const distributeMarks = async (marks)=>{
        const user = await marksDistributionAPI(marks);

    }
    useEffect(()=>{
        console.log('User State:',state)
    },[state]);
    return (
        <UserContext.Provider value={{
            user:state,
            fetchUserById,
            createUser,
            distributeMarks
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;