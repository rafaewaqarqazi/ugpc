export const isTaskValid = (state,error, setError)=>{
   if (state.description.trim().length < 20 || state.description.trim().length > 1000){
        setError({
            ...error,
            description:{
                show:true,
                message:'Description should be between 20-1000 characters'
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
    else if (state.storyPoints.trim().length === 0){
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

};

export const isSubTaskValid = (subTask,error, setError)=>{
    if (subTask.title.trim().length < 2 || subTask.title.trim().length > 100){
        setError({
            ...error,
            subTask:{
                ...error.subTask,
                title:{
                show:true,
                message:'Title must be between 2-100 characters'
                }
            }
        });
        return false;
    }
    else if (subTask.description.trim().length < 10 || subTask.description.trim().length > 500){
        setError({
            ...error,
            subTask:{
                ...error.subTask,
                description:{
                    show:true,
                    message:'Description must be between 10-500 characters'
                }
            }
        });
        return false;
    }
    return true;

}