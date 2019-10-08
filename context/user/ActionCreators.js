import * as Actions from './ActionTypes';
import {fetchUserByIdAPI, createNewUserAPI} from "../../utils/apiCalls/users";


export const getUserById = async (dispatch)=>{
    dispatch(userLoading());
    const user = await fetchUserByIdAPI();
    dispatch(addUser(user));
};
export const createNewUser = async (user,dispatch)=>{
    return await createNewUserAPI(user);
};

//Action Dispatchers
export const addUser = user=>({
    type:Actions.ADD_USER,
    payload:user
});
export const userLoading = ()=>({
    type:Actions.USER_LOADING
});

export const uploadProfileImageAction = (filename) => ({
    type:Actions.ADD_PROFILE_IMAGE,
    payload:filename
});
export const changeNameAction = name =>({
    type:Actions.CHANGE_NAME,
    payload:name
});
export const addNewBatchAction = batches =>({
    type:Actions.ADD_NEW_BATCH,
    payload:batches
});
export const marksDistributionAction = marks =>({
    type:Actions.ADD_MARKS,
    payload:marks
})