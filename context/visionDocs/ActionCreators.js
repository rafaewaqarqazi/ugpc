import * as Actions from './ActionTypes';

//Actions
export const addDocsAction = (project) => ({
  type: Actions.ADD_DOCS,
  payload: project
});
export const docsLoadingAction = () => ({
  type: Actions.DOCS_LOADING
});
export const docsFailedAction = errMess => ({
  type: Actions.DOCS_FAILED,
  payload: errMess
})