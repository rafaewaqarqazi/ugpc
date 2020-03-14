export const isValid = (state, setTitleError, setAbstractError, setScopeError, setModulesError, setFileError) => {
  const {title, abstract, scope, modules, file, activeStep} = state;
  if ((title.trim().length < 2 || title.trim().length > 100) && activeStep === 0) {
    setTitleError();

    return true;
  } else if ((abstract.trim().length < 50 || abstract.trim().length > 1000) && activeStep === 0) {
    setAbstractError();

    return true;
  } else if ((scope.trim().length < 50 || scope.trim().length > 1000) && activeStep === 0) {
    setScopeError();

    return true;
  } else if (modules.length === 0 && activeStep === 1) {
    setModulesError();

    return true;
  } else if ((file.length === 0) && activeStep === 2) {
    setFileError();

    return true;
  }

  return false;
};