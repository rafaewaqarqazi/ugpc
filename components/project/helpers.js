export const getCompletionPercentage = details =>{
    let completed = 0;
    let total = 0;
    total += details.backlog.length;
    details.sprint.map(sprint => {
        total +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;
        completed +=sprint.done.length;
    });
    return parseFloat(((completed / total) * 100).toFixed(2));
};