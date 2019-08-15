import * as Actions from './ActionTypes'

export const userReducer = (state, action) => {

    switch (action.type) {
        case Actions.ADD_USER:
            return {
                ...state,
                isLoading:false,
                errMess: null,
                user:action.payload,
            };
        case Actions.USER_LOADING:
            return {
                ...state,
                isLoading: true,
                errMess: null,
                user: {}
            };
        case Actions.USER_FAILED:
            return {
                ...state,
                isLoading: false,
                errMess: action.payload,
                user: {}
            };
        case Actions.REMOVE_USER:
            return {};
        default:
            return state;
    }
};