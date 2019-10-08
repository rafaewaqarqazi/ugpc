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
        case Actions.ADD_PROFILE_IMAGE:
            return {
                ...state,
                user: {
                    ...state.user,
                    profileImage:{
                        filename:action.payload
                    }
                }
            };
        case Actions.CHANGE_NAME:
            return {
                ...state,
                user: {
                    ...state.user,
                    name:action.payload
                }
            };
        case Actions.ADD_NEW_BATCH:
            return {
                ...state,
                user: {
                    ...state.user,
                    chairman_details:{
                        ...state.user.chairman_details,
                        settings: {
                            ...state.user.chairman_details.settings,
                            batches: action.payload
                        }
                    }
                }
            };
        case Actions.ADD_MARKS:
            return {
                ...state,
                user: {
                    ...state.user,
                    chairman_details:{
                        settings: {
                            ...state.user.chairman_details.settings,
                            marksDistribution: action.payload
                        }
                    }
                }
            };
        case Actions.REMOVE_USER:
            return {};
        default:
            return state;
    }
};