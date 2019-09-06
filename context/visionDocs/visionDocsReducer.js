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
        case Actions.ADD_MARKS:
            const newState = state.visionDocs.map(doc =>({
                ...doc,
                projects:doc.projects.map(project =>{
                    if(project._id === '5d4d7298c0f2d61f04d3254d'){
                        return {
                            ...project,
                            details:{
                                ...project.details,
                                marks:{
                                    ...project.details.marks,
                                    visionDocument:'9'
                                }
                            }
                        }
                    }
                    else {
                        return {
                            ...project
                        }
                    }

                })
            }))

            return {
                ...state,
                visionDocs: newState
            }
        default:
            return state;
    }
};