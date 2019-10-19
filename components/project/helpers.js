import moment from "moment";

export const getCompletionPercentage = details =>{
    let completed = 0;
    let total = 0;
    total += details.backlog.length;
    details.sprint.map(sprint => {
        const todos = sprint.tasks.filter(task => task.status === 'todo').length;
        const inProgress = sprint.tasks.filter(task => task.status === 'inProgress').length;
        const inReview = sprint.tasks.filter(task => task.status === 'inReview').length;
        const done = sprint.tasks.filter(task => task.status === 'done').length;
        if (sprint.status === 'Completed'){
            completed +=done;
            total += done;
        }else{
            total +=todos + inProgress + inReview + done;
        }
    });
    return parseFloat(((completed / total) * 100).toFixed(2));
};
export const getTotalTasksCount = details =>{
    let totaltasks = 0;

    totaltasks += details.backlog.length;
    details.sprint.map(sprint => {
        const todos = sprint.tasks.filter(task => task.status === 'todo').length;
        const inProgress = sprint.tasks.filter(task => task.status === 'inProgress').length;
        const inReview = sprint.tasks.filter(task => task.status === 'inReview').length;
        const done = sprint.tasks.filter(task => task.status === 'done').length;
        totaltasks +=todos + inProgress + inReview + done;

    });
    return totaltasks
};
export const getCompletedTasksCount = details =>{
    let completed = 0;

    details.sprint.map(sprint => {
        completed +=sprint.tasks.filter(task => task.status === 'done').length;
    });
    return completed
};
export const getSprintsPercentage = details =>{
    let count = 0;
    if (details.sprint.length === 0){
        return 0
    }

    details.sprint.map(sprint => {
        if (sprint.status === 'Completed'){
            const todos = sprint.tasks.filter(task => task.status === 'todo').length;
            const inProgress = sprint.tasks.filter(task => task.status === 'inProgress').length;
            const inReview = sprint.tasks.filter(task => task.status === 'inReview').length;
            const done = sprint.tasks.filter(task => task.status === 'done').length;
            if (todos === 0 && inProgress === 0 && inReview === 0 && done > 0)
                count +=1;
        }

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
            done +=sprint.tasks.filter(task => task.status === 'done').length;
        }else {
            todos +=sprint.tasks.filter(task => task.status === 'todo').length;
            inProgress +=sprint.tasks.filter(task => task.status === 'inProgress').length;
            inReview +=sprint.tasks.filter(task => task.status === 'inReview').length;
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
            s.tasks.map(task =>{
                if (task.status === 'done'){
                    totalStoryPointsCompleted +=parseInt(task.storyPoints)
                }
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
            s.tasks.map(task =>{
                total +=parseInt(task.storyPoints)
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
            s.tasks.map(task =>{
                if (task.status === 'done'){
                    completed +=parseInt(task.storyPoints)
                }
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