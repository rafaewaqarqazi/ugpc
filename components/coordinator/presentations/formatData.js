export const formatData = docs => {
    const ids = Array.from(docs.map(doc => doc._id));
    let projects = {}
    Array.from(docs.map(doc => doc._id),(id,index)=>{
        projects = {
            ...projects,
            [id]:docs[index]
        }
        return projects
    });
    console.log(projects);

    const data = {
        projects:projects,
        columns:{
            'column-1':{
                'id':'column-1',
                title:'Schedule Presentations',
                projectsIds:[]
            },
            'column-2':{
                'id':'column-2',
                title:'Docs To Schedule',
                projectsIds:ids
            },
        },
        columnOrder:['column-1','column-2']
    }
    console.log(data)
    return data;
}

export const formatBacklog = backlog => {
    const sortedBacklog = backlog.sort((a,b)=>a.priority-b.priority)
    const ids = Array.from(sortedBacklog.map(backlg => backlg._id));
    let tasks = {}

    console.log(sortedBacklog)
    sortedBacklog.map((backlg,index) =>{
        tasks = {
            ...tasks,
            [backlg._id]:backlg
        }
        // return tasks
    });
    const data = {
        tasks:tasks,
        columns:{
            'column-1':{
                'id':'column-1',
                title:'Create Sprint',
                tasksIds:[]
            },
            'column-2':{
                'id':'column-2',
                title:'Backlog',
                tasksIds:ids
            },
        },
        columnOrder:['column-1','column-2']
    }
    console.log(data)
    return data;
};

export const formatScrumBoard = sprint => {
    const sortedTodos =sprint ? sprint.todos.sort((a,b)=>a.priority-b.priority):[];
    const sortedInProgress = sprint ? sprint.inProgress.sort((a,b)=>a.priority-b.priority):[];
    const sortedInReview = sprint ? sprint.inReview.sort((a,b)=>a.priority-b.priority):[];
    const sortedDone = sprint ? sprint.done.sort((a,b)=>a.priority-b.priority):[];
    const todoIds =sprint ? Array.from(sortedTodos.map(todo => todo._id)) :[];
    const inProgressIds =sprint ?  Array.from(sortedInProgress.map(inPrg => inPrg._id)) :[];
    const inReviewIds =sprint ?  Array.from(sortedInReview.map(inRev => inRev._id)) :[];
    const doneIds =sprint ?  Array.from(sortedDone.map(done => done._id)):[];
    let tasks = {}
    if (sprint){
        sprint.todos.map(todo => {
            tasks = {
                ...tasks,
                [todo._id]:todo
            }
        })
        sprint.inProgress.map(inPrg => {
            tasks = {
                ...tasks,
                [inPrg._id]:inPrg
            }
        })
        sprint.inReview.map(inRev => {
            tasks = {
                ...tasks,
                [inRev._id]:inRev
            }
        })
        sprint.done.map(done => {
            tasks = {
                ...tasks,
                [done._id]:done
            }
        })
    }

    console.log(tasks);

    const data = {
        tasks,
        columns:{
            'todos':{
                'id':'todos',
                title:'Todos',
                tasksIds:todoIds
            },
            'inProgress':{
                'id':'inProgress',
                title:'In Progress',
                tasksIds:inProgressIds
            },
            'inReview':{
                'id':'inReview',
                title:'In Review',
                tasksIds:inReviewIds
            },
            'done':{
                'id':'done',
                title:'Done',
                tasksIds:doneIds
            },
        },
        columnOrder:['todos','inProgress','inReview','done']
    }
    console.log(data)
    return data;

};

export const formatRoadmapSprintData = details =>{
    console.log(details.sprint)
    let sprintData = details.sprint.map(spr => {
        const total = spr.todos.length + spr.inProgress.length + spr.inReview.length + spr.done.length;
        const percentage = parseFloat(((spr.done.length / total) * 100).toFixed(2))
        return [spr._id,spr.name,new Date(spr.startDate), new Date(spr.endDate),null,percentage,null]
    });
    // let completed = 0;
    // let totaltasks = 0;
    // totaltasks += details.backlog.length;
    // details.sprint.map(sprint => {
    //     totaltasks +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;
    //     completed +=sprint.done.length;
    // });
    // const project = [
    //     'Project',
    //     'Implemetation',
    //     new Date(details.acceptanceLetter.issueDate),
    //     new Date(details.estimatedDeadline),
    //     null,
    //     parseFloat(((completed / totaltasks) * 100).toFixed(2)),
    //     null,
    // ]
    const data = [
        [
            { type: 'string', label: 'Sprint ID' },
            { type: 'string', label: 'Spring Name' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ],
        ...sprintData
    ];

    return data
};
export const formatRoadmapProjectData = details =>{
    console.log(details.sprint)

    let completed = 0;
    let totaltasks = 0;
    totaltasks += details.backlog.length;
    details.sprint.map(sprint => {
        totaltasks +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;
        completed +=sprint.done.length;
    });
    const project = [
        'Project',
        'Implemetation',
        new Date(details.acceptanceLetter.issueDate),
        new Date(details.estimatedDeadline),
        null,
        parseFloat(((completed / totaltasks) * 100).toFixed(2)),
        null,
    ]
    const data = [
        [
            { type: 'string', label: 'Sprint ID' },
            { type: 'string', label: 'Spring Name' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ],
        project
    ];

    return data
}