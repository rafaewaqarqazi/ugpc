export const isValid = (state,setTitleError,setAbstractError,setScopeError,setModulesError,setFileError)=>{
    const {title, abstract, scope, modules,file,activeStep} = state;
    if ((title.length <=2 || title.length > 100) && activeStep === 0){
        setTitleError();

       return true;
    }else if ((abstract.length < 50 || abstract.length > 500) && activeStep === 0 ){
        setAbstractError();

        return true;
    } else if ((scope.length < 50 || scope.length > 500) && activeStep === 0 ){
        setScopeError();

        return true;
    }else if (modules.length === 0 && activeStep === 1 ){
        setModulesError();

        return true;
    }
    else if ((file.length === 0) && activeStep === 2 ){
        setFileError();

        return true;
    }

    return false;
};