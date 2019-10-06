import React, {useReducer, useEffect} from 'react';
import UserContext from './user-context';
import {userReducer} from "./userReducer";
import {getUserById, createNewUser,uploadProfileImageAction,changeNameAction} from "./ActionCreators";
import {
    marksDistributionAPI,
    uploadProfileImageAPI,
    changeNameAPI,
    changePasswordAPI
} from '../../utils/apiCalls/users';

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

    };
    const uploadProfileImage = async image =>{
        const result = await uploadProfileImageAPI(image);
       await dispatch(uploadProfileImageAction(result));
       return await result
    };
    const changeName = async data =>{
        const result = await changeNameAPI(data);
         dispatch(changeNameAction(data.name));
        return await result
    };
    const changePassword = async data =>{
        const result = await changePasswordAPI(data);
        return await result
    };
    useEffect(()=>{
        console.log('User State:',state)
    },[state]);
    return (
        <UserContext.Provider value={{
            user:state,
            fetchUserById,
            createUser,
            distributeMarks,
            uploadProfileImage,
            changeName,
            changePassword
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;