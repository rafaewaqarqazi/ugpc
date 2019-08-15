import * as Actions from './ActionTypes';
import {fetchUserByIdAPI} from "../../utils/apiCalls/users";


export const getUserById = async (dispatch)=>{
    dispatch(userLoading());
    const user = await fetchUserByIdAPI();
    dispatch(addUser(user));
};

//Action Dispatchers
export const addUser = user=>({
    type:Actions.ADD_USER,
    payload:user
});
export const userLoading = ()=>({
    type:Actions.USER_LOADING
});