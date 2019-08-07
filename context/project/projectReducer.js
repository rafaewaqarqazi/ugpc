import * as Actions from './ActionTypes'

export const projectReducer = (state, action) => {

    switch (action.type) {
        case Actions.ADD_PROJECT:
            console.log('ACTION',action.payload);
            return {
                ...state,
                isLoading:false,
                errMess: null,
                project:action.payload,
            };
        case Actions.PROJECT_LOADING:
            return {
                ...state,
                isLoading: true,
                errMess: null,
                project: {}
            };
        case Actions.PROJECT_FAILED:
            return {
                ...state,
                isLoading: false,
                errMess: action.payload,
                project: {}
            };
        case Actions.REMOVE_PROJECT:
            return {};
        default:
            return state;
    }
};