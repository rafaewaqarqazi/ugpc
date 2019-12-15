export const isValid = (data,setErrors,errors,activeStep)=>{
    const {groupName, description, partnerId, team} = data;
    let error = false;
    if ((groupName.trim().length <=2 || groupName.trim().length > 50) && activeStep === 0){
        setErrors({
            ...errors,
            groupName:{
                show:true,
                message:'Group Name Must Be between 2-50 Characters'
            }
        });
        error = true;
    }else if ((description.trim().length <= 50 || description.trim().length > 400) && activeStep === 1 ){
        setErrors({
            ...errors,
            description:{
                show:true,
                message:'Description Must Be between 50-400 Characters'
            }
        });
        error = true;
    } else if ((team === 'duo' && partnerId.length === 0) && activeStep === 1){
        setErrors({
            ...errors,
            partnerId:{
                show:true,
                message:'Please Select Your Partner'
            }
        });
        error = true;
    }
    return error;
};