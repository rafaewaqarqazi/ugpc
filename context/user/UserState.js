import React, {useReducer, useEffect} from 'react';
import UserContext from './user-context';
import {userReducer} from "./userReducer";
import {
    getUserById,
    createNewUser,
    uploadProfileImageAction,
    changeNameAction,
    addNewBatchAction,
    marksDistributionAction,
    addAllUsersAction,
    allUsersLoadingAction,
    removeUserAction
} from "./ActionCreators";
import {
    marksDistributionAPI,
    uploadProfileImageAPI,
    changeNameAPI,
    changePasswordAPI,
    addNewBatchAPI,
    removeBatchAPI,
    fetchAllUsersAPI,
    removeUserAPI
} from '../../utils/apiCalls/users';

const UserState = (props) => {
    const [state, dispatch] = useReducer(userReducer,{
        isLoading:true,
        errMess:null,
        user:{},
        users:{
            isLoading:true,
            allUsers:[]
        }
    });
    const fetchUserById =async ()=>{
        return await getUserById(dispatch);
    };
    const createUser =async user=>{
        return await createNewUser(user,dispatch);
    };
    const distributeMarks = async (marks)=>{
        const user = await marksDistributionAPI(marks);
       await dispatch(marksDistributionAction(user.chairman_details.settings.marksDistribution))
        return await user;
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
        return  await changePasswordAPI(data);
    };
    const addNewBatch = async newBatch =>{
        const result = await addNewBatchAPI(newBatch);
       await dispatch(addNewBatchAction(result.chairman_details.settings.batches));
        return await result;
    };
    const removeBatch = async batch =>{
        const result =await removeBatchAPI(batch);
        await dispatch(addNewBatchAction(result.chairman_details.settings.batches));
        return await result;
    };
    const fetchAllUsers = async ()=>{
        dispatch(allUsersLoadingAction())
        const users = await fetchAllUsersAPI();
        dispatch(addAllUsersAction(users))
    };
    const removeUser = async (userId,type)=>{
        const result =await removeUserAPI(userId);
        dispatch(removeUserAction(userId,type))
        return await result
    }
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
            changePassword,
            addNewBatch,
            removeBatch,
            fetchAllUsers,
            removeUser
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;