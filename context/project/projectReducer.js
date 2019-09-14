import * as Actions from './ActionTypes'

export const projectReducer = (state, action) => {

    switch (action.type) {
        case Actions.ADD_PROJECT:
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
        case Actions.ADD_BACKLOG_ANDSPRINT:
            const newState = state.project.map(proj => {
                if (proj._id === action.payload.projectId){
                    return {
                        ...proj,
                        details:{
                            ...proj.details,
                            backlog:action.payload.details.backlog,
                            sprint:action.payload.details.sprint
                        }
                    }
                }
                else {
                    return {...proj}
                }
            })
            return {
                ...state,
                project: newState
            }
        default:
            return state;
    }
};