import * as Actions from './actions'

export const studentReducer = (state, action) => {

    switch (action.type) {
        case Actions.SET_STUDENT:
            console.log('ACTION',action.payload);
            return {
                ...state,
                ...action.payload
            };
        case Actions.REMOVE_STUDENT:
            return {};
        default:
            return state;
    }
};