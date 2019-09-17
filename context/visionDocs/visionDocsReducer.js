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
        case Actions.ADD_MARKS:{
            const newState = state.visionDocs.map(doc =>({
                ...doc,
                projects:doc.projects.map(project =>{
                    if(project._id === action.payload.projectId){
                        return {
                            ...project,
                            details:{
                                ...project.details,
                                marks:{
                                    ...project.details.marks,
                                    visionDocument:action.payload.marks
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
            };
        }
        case Actions.ADD_ACCEPTANCE_LETTER:{
            const modState = state.visionDocs.map(doc =>({
                ...doc,
                projects:doc.projects.map(project =>{
                    if(project._id === action.payload.projectId){
                        return {
                            ...project,
                            details:{
                                ...project.details,
                                acceptanceLetter:{
                                    name:`${action.payload.regNo}.pdf`,
                                    issueDate:action.payload.issueDate
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
                visionDocs: modState
            };
        }
        case Actions.ADD_SUPERVISOR:{
            const modState = state.visionDocs.map(doc =>({
                ...doc,
                projects:doc.projects.map(project =>{
                    if(project._id === action.payload.projectId){
                        return {
                            ...project,
                            details:{
                                ...project.details,
                                supervisor:action.payload.supervisor
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
                visionDocs: modState
            };
        }
        case Actions.CHANGE_STATUS:{
            const modState = state.visionDocs.map(doc =>({
                ...doc,
                projects:doc.projects.map(project =>{
                    if(project._id === action.payload.projectId){
                        return {
                            ...project,
                            documentation:{
                                ...project.documentation,
                                visionDocument:project.visionDocument.map(visionDoc =>{
                                    if (visionDoc._id === action.payload.documentId){
                                        return{
                                            ...visionDoc,
                                            status:action.payload.status
                                        }
                                    }else {
                                        return {...visionDoc}
                                    }
                                })
                            }
                        }
                    }
                    else {
                        return {
                            ...project
                        }
                    }

                })
            }));

            return {
                ...state,
                visionDocs: modState
            };
        }
        default:
            return state;
    }
};