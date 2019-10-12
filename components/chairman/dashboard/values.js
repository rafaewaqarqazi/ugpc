export const getTotalNoUsers = allUsers =>{
    let count = 0;
    allUsers.map(users =>{
        count+=users.users.length
    });
    return count
};

export const getUsersLabel = allUsers =>{
    let label = [];
    allUsers.map(users =>{
        label=[...label,users._id]
    });
    return label
};
export const getUsersChartData = allUsers =>{
    let data = [];
    allUsers.map(users =>{
        data=[...data,users.users.length]
    });
    return data
};

export const formatProjectsData = projects =>{
    let projectsData = projects.map(project => {
        let totalTasks = project.details.backlog.length;
        let completedTasks = 0;
        project.details.sprint ? project.details.sprint.map(sprint => {
            if (sprint.status === 'Completed'){
                completedTasks += sprint.done.length;
                totalTasks += sprint.done.length;
            }else {
                totalTasks +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;
            }
        }):
            completedTasks = 0;
        const percentage = parseFloat(((completedTasks / totalTasks) * 100).toFixed(2));
        return [project._id,project.documentation.visionDocument.title,new Date(project.details.acceptanceLetter.issueDate), new Date(project.details.estimatedDeadline),null,percentage,null]
    });
    const data = [
        [
            { type: 'string', label: 'Project ID' },
            { type: 'string', label: 'Project Title' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ],
        ...projectsData
    ];

    return data
}