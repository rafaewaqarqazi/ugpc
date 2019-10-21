import moment from "moment";

export   const getBacklogTaskPriorityColor = priority =>{
    if (priority === '1'){
        return {
            borderLeft:'6px solid #f44336'
        }
    }
    else if (priority === '2'){
        return {
            borderLeft:'6px solid #ff9800'
        }
    }
    else if (priority === '3'){
        return {
            borderLeft:'6px solid #ffc107'
        }
    }
    else if (priority === '4'){
        return {
            borderLeft:'6px solid #03a9f4'
        }
    }
    else if (priority === '5'){
        return {
            borderLeft:'6px solid #4caf50'
        }
    }
};
export const getSprintTaskPriorityColor = priority =>{
    if (priority === '1'){
        return {
            borderTop:'8px solid #f44336'
        }
    }
    else if (priority === '2'){
        return {
            borderTop:'8px solid #ff9800'
        }
    }
    else if (priority === '3'){
        return {
            borderTop:'8px solid #ffc107'
        }
    }
    else if (priority === '4'){
        return {
            borderTop:'8px solid #03a9f4'
        }
    }
    else if (priority === '5'){
        return {
            borderTop:'8px solid #4caf50'
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
    else if (status === 'Approved With Changes'){
        return {
            backgroundColor:'#004D40',
            color:'white'
        }
    }
    else if (status === 'Approved'){
        return {
            backgroundColor:'#2e7d32',
            color:'white'
        }
    }
    else if (status === 'Rejected'){
        return {
            backgroundColor:'#b71c1c',
            color:'white'
        }
    }
};

export const getEvaluationListBorderColor = status =>{
    if (status === 'Available for Internal'){
        return {
            borderLeft:'6px solid #1A237E'
        }
    }
    else if (status === 'Internal Scheduled'){
        return {
            borderLeft:'6px solid #ff9800'
        }
    }
    else if (status === 'Available for External'){
        return {
            borderLeft:'6px solid #ffc107'
        }
    }
    else if (status === 'External Scheduled'){
        return {
            borderLeft:'6px solid #03a9f4'
        }
    }
    else if (status === 'Completed'){
        return {
            borderLeft:'6px solid #4caf50',
        }
    }
};

export const getGradeChipColor = grade =>{
    if (grade === 'A'){
        return {
            backgroundColor:'#2e7d32',
            color:'white'
        }
    }
    else if (grade === 'B+'){
        return {
            backgroundColor:'#004D40',

            color:'white'
        }
    }
    else if (grade === 'B'){
        return {
            backgroundColor:'#FBC02D',
            color:'white'
        }
    }
    else if (grade === 'C+'){
        return {
            backgroundColor:'#1565C0',
            color:'white'
        }
    }
    else if (grade === 'C'){
        return {
            backgroundColor:'#1A237E',
            color:'white'
        }
    }
    else if (grade === 'D+'){
        return {
            backgroundColor:'#b71c1c',
            color:'white'
        }
    } else if (grade === 'D'){
        return {
            backgroundColor:'#b71c1c',
            color:'white'
        }
    } else if (grade === 'F'){
        return {
            backgroundColor:'#b71c1c',
            color:'white'
        }
    }
};

export const getSupervisorMeetingChipColor = meeting =>{
    if (!meeting.isAttended && moment(Date.now()).isBefore(meeting.date)){
        return {
            backgroundColor:'#1A237E',
            color:'white'
        }
    }
    else if (!meeting.isAttended && !moment(Date.now()).isBefore(meeting.date)){
        return {
            backgroundColor:'#b71c1c',

            color:'white'
        }
    }
    else if (meeting.isAttended){
        return {
            backgroundColor:'#2e7d32',
            color:'white'
        }
    }
};