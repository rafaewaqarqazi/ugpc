export const isTaskValid = (state,error, setError)=>{
    if (state.title.length <=5 || state.title.length >=30){
        setError({
            ...error,
            title:{
                show:true,
                message:'Title should be between 5-30 chars'
            }
        })
        return false;
    }
    else if (state.description.length <=20 || state.description.length >=200){
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