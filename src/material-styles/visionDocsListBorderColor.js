export   const getVisionDocsListBorderColor = status =>{
    if (status === 'Waiting for Initial Approval'){
        return {
            borderLeft:'4px solid #1A237E'
        }
    }
    else if (status === 'Approved for Meeting'){
        return {
            borderLeft:'4px solid #1565C0'
        }
    }
    else if (status === 'Meeting Scheduled'){
        return {
            borderLeft:'4px solid #FBC02D'
        }
    }
    else if (status === 'Approved With Changes'){
        return {
            borderLeft:'4px solid #004D40'
        }
    }
    else if (status === 'Approved'){
        return {
            borderLeft:'4px solid #4CAF50'
        }
    }
    else if (status === 'Rejected'){
        return {
            borderLeft:'4px solid #b71c1c'
        }
    }
};

export const getVisionDocsStatusChipColor = status =>{
    if (status === 'Waiting for Initial Approval'){
        return {
            backgroundColor:'#1A237E',
            color:'white'
        }
    }
    else if (status === 'Approved for Meeting'){
        return {
            backgroundColor:'#1565C0',
            color:'white'
        }
    }
    else if (status === 'Meeting Scheduled'){
        return {
            backgroundColor:'#FBC02D',
            color:'white'
        }
    }
    else if (status === 'Approved with Changes'){
        return {
            backgroundColor:'#004D40',
            color:'white'
        }
    }
    else if (status === 'Approved'){
        return {
            backgroundColor:'#4CAF50',
            color:'white'
        }
    }
    else if (status === 'Rejected'){
        return {
            backgroundColor:'#b71c1c',
            color:'white'
        }
    }
}