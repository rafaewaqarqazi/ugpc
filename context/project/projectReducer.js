import * as Actions from './ActionTypes'

export const projectReducer = (state, action) => {

  switch (action.type) {
    case Actions.ADD_PROJECT:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        project: action.payload,
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
    case Actions.ADD_BACKLOG: {
      const newState = {
        ...state.project,
        details: {
          ...state.project.details,
          backlog: action.payload.backlog,
        }
      };
      return {
        ...state,
        project: newState
      };
    }
    case Actions.ADD_SPRINT: {
      const modState = {
        ...state.project,
        details: {
          ...state.project.details,
          sprint: action.payload.sprint,
        }
      };
      return {
        ...state,
        project: modState
      };
    }
    case Actions.ADD_FINAL_DOCUMENTATION: {
      const modState = {
        ...state.project,
        documentation: {
          ...state.project.documentation,
          finalDocumentation: action.payload,
        }
      };
      return {
        ...state,
        project: modState
      };
    }
    case Actions.ADD_SUPERVISOR_MEETINGS: {
      const modState = {
        ...state.project,
        details: {
          ...state.project.details,
          meetings: action.payload,
        }
      };
      return {
        ...state,
        project: modState
      };
    }
    case Actions.EDIT_COMMENT: {
      const newState = state.project.documentation.visionDocument.map(vDoc => {
        if (vDoc._id === action.payload.documentId) {
          return {
            ...vDoc,
            comments: vDoc.comments.map(comment => {
              if (comment._id === action.payload.commentId) {
                return {
                  ...comment,
                  text: action.payload.text
                }
              } else return comment
            })
          }
        } else return vDoc
      })
      return {
        ...state,
        project: {
          ...state.project,
          documentation: {
            ...state.project.documentation,
            visionDocument: newState
          }
        }
      }
    }
    case Actions.DELETE_COMMENT: {
      const newState = state.project.documentation.visionDocument.map(vDoc => {
        if (vDoc._id === action.payload.documentId) {
          return {
            ...vDoc,
            comments: vDoc.comments.filter(comment => comment._id !== action.payload.commentId)
          }
        } else return vDoc
      });
      return {
        ...state,
        project: {
          ...state.project,
          documentation: {
            ...state.project.documentation,
            visionDocument: newState
          }
        }
      }
    }
    default:
      return state;
  }
};