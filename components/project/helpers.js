import moment from "moment";

export const getCompletionPercentage = details =>{
    let completed = 0;
    let total = 0;
    total += details.backlog.length;
    details.sprint.map(sprint => {
        if (sprint.status === 'Completed'){
            completed +=sprint.done.length;
            total += sprint.done.length;
        }else{
            total +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;
        }
    });
    return parseFloat(((completed / total) * 100).toFixed(2));
};
export const getTotalTasksCount = details =>{
    let totaltasks = 0;

    totaltasks += details.backlog.length;
    details.sprint.map(sprint => {
        totaltasks +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;

    });
    return totaltasks
};
export const getCompletedTasksCount = details =>{
    let completed = 0;

    details.sprint.map(sprint => {
        completed +=sprint.done.length;
    });
    return completed
};
export const getSprintsPercentage = details =>{
    let count = 0;
    if (details.sprint.length === 0){
        return 0
    }

    details.sprint.map(sprint => {
        if (sprint.todos.length === 0 && sprint.inProgress.length === 0 && sprint.inReview.length === 0 && sprint.done.length > 0)
            count +=1;
    });

    return parseFloat(((count / details.sprint.length) * 100).toFixed(2))
};
export const getSprintDataSet = details =>{
    let todos = 0;
    let inProgress = 0;
    let inReview = 0;
    let done = 0;
    details.sprint.map(sprint => {
        if (sprint.status === 'Completed'){
            done +=sprint.done.length;
        }else {
            todos +=sprint.todos.length;
            inProgress +=sprint.inProgress.length;
            inReview +=sprint.inReview.length;
        }

    });

    return [todos,inProgress,inReview,done]
};
export const getSprintLabels = sprint =>{
    return sprint.map(s =>{
        if (s.status === 'Completed'){
            return s.name
        }
    }).filter(f => f !== undefined)
};
export const getSprintVelocity = sprint =>{
    let totalSprints = 0;
    let totalStoryPointsCompleted = 0;
    sprint.map(s =>{
        if (s.status === 'Completed'){
            s.done.map(done =>{
                totalStoryPointsCompleted +=parseInt(done.storyPoints)
            });
            totalSprints++;
        }
    })
    return totalSprints === 0 ? 0 : parseFloat((totalStoryPointsCompleted / totalSprints).toFixed(2))
};
export const getTotalStoryPoints = sprint =>{
    let data = [];
    sprint.map(s =>{
        let total = 0;
        if (s.status === 'Completed'){
            s.todos.map(todos =>{
                total +=parseInt(todos.storyPoints)
            });
            s.inProgress.map(inProgress =>{
                total +=parseInt(inProgress.storyPoints)
            });
            s.inReview.map(inReview =>{
                total +=parseInt(inReview.storyPoints)
            });
            s.done.map(done =>{
                total +=parseInt(done.storyPoints)
            });
            data = [...data,total]
        }
    });
    return data
};
export const getCompletedStoryPoints = sprint =>{
    let data = [];
    sprint.map(s =>{
        let completed = 0;
        if (s.status === 'Completed'){
            s.done.map(done =>{
                completed +=parseInt(done.storyPoints)
            });
            data = [...data,completed]
        }
    });
    return data
};
export const getSprintTableRowBorder = sprint =>{
    if (sprint.status === 'InComplete' && moment(Date.now()).isBefore(sprint.endDate)){
        return {
            borderLeft:'4px solid #1565C0'
        }
    }
    else if (sprint.status === 'InComplete' && !moment(Date.now()).isBefore(sprint.endDate)){
        return {
            borderLeft:'4px solid #f44336'
        }
    }
    else if (sprint.status === 'Completed' && !moment(sprint.completedOn).isBefore(sprint.endDate)){
        return {
            borderLeft:'4px solid #ff9800'
        }
    }
    else if (sprint.status === 'Completed' && moment(sprint.completedOn).isBefore(sprint.endDate)){
        return {
            borderLeft:'4px solid #4caf50'
        }
    }
}