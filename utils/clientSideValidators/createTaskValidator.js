export const isTaskValid = (state,error, setError)=>{
   if (state.description.length <=20 || state.description.length >=200){
        setError({
            ...error,
            description:{
                show:true,
                message:'Description should be between 20-200 chars'
            }
        })
        return false;
    }
    else if (state.assignee.length === 0){
        setError({
            ...error,
            assignee:{
                show:true,
                message:'Please Select Assignee(s)'
            }
        })
        return false;
    }
    else if (state.storyPoints.length === 0){
        setError({
            ...error,
            storyPoints:{
                show:true,
                message:'Please Specify Story Points'
            }
        })
        return false;
    }
    return true;

}