import * as Actions from './ActionTypes'

export const visionDocsReducer = (state, action) => {

    switch (action.type) {
        case Actions.ADD_DOCS:
            return {
                ...state,
                isLoading:false,
                errMess: null,
                visionDocs:action.payload,
            };
        case Actions.DOCS_LOADING:
            return {
                ...state,
                isLoading: true,
                errMess: null,
                visionDocs: []
            };
        case Actions.DOCS_FAILED:
            return {
                ...state,
                isLoading: false,
                errMess: action.payload,
                visionDocs: []
            };
        case Actions.REMOVE_DOCS:
            return [];
        default:
            return state;
    }
};