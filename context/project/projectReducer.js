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
        case Actions.ADD_BACKLOG:{
            const newState = state.project.map(project => {
                if (project._id === action.payload.projectId){
                    return {
                        ...project,
                        details:{
                            ...project.details,
                            backlog:action.payload.backlog,
                        }
                    }
                }
                else {
                    return {...project}
                }
            });
            return {
                ...state,
                project: newState
            };
        }
        case Actions.ADD_SPRINT:{
            const modState = state.project.map(project => {
                if (project._id === action.payload.projectId){
                    return {
                        ...project,
                        details:{
                            ...project.details,
                            sprint:action.payload.sprint,
                        }
                    }
                }
                else {
                    return {...project}
                }
            });
            return {
                ...state,
                project: modState
            };
        }
        default:
            return state;
    }
};