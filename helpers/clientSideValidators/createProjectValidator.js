export const isValid = (data,setErrors,errors,activeStep)=>{
    const {title, description, partnerId, team} = data;
    console.log(team);
    let error = false;
    if ((title.length <=2 || title.length > 100) && activeStep === 0){
        setErrors({
            ...errors,
            title:{
                show:true,
                message:'Title Must Be between 2-100 Characters'
            }
        });
        error = true;
    }else if ((description.length <= 50 || description.length > 200) && activeStep === 1 ){
        setErrors({
            ...errors,
            description:{
                show:true,
                message:'Description Must Be between 50-200 Characters'
            }
        });
        error = true;
    } else if ((team === 'duo' && partnerId.length === 0) && activeStep === 1){
        console.log('partner ID',errors);
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