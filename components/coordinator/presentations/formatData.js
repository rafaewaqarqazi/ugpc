import moment from "moment";
export const formatData = docs => {
    const sortedDocs = docs.sort((a,b)=> new Date(a.updatedAt) - new Date(b.updatedAt));
    const ids = Array.from(docs.map(doc => doc._id));
    let projects = {};
    sortedDocs.map(doc => {
        projects = {
            ...projects,
            [doc._id]:doc
        }
    })

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
                title:'Projects To Schedule',
                projectsIds:ids
            },
        },
        columnOrder:['column-1','column-2']
    };
    return data;
}

export const formatBacklog = backlog => {
    const sortedBacklog = backlog.sort((a,b)=>a.priority-b.priority)
    const ids = sortedBacklog.map(backlg => backlg._id);
    let tasks = {}

    sortedBacklog.map((backlg) =>{
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
    };
    return data;
};

export const formatScrumBoard = sprint => {
    const todos = sprint ? sprint.tasks.filter(task => task.status === 'todo').sort((a,b)=>a.priority-b.priority):[];
    console.log('todos',todos);
    const inProgress = sprint ? sprint.tasks.filter(task => task.status === 'inProgress').sort((a,b)=>a.priority-b.priority):[];
    console.log('inProgress',inProgress);
    const inReview = sprint ? sprint.tasks.filter(task => task.status === 'inReview').sort((a,b)=>a.priority-b.priority):[];
    console.log('inReview',inReview);
    const done = sprint ? sprint.tasks.filter(task => task.status === 'done').sort((a,b)=>a.priority-b.priority):[];
    console.log('done',done);
    // const sortedTodos =sprint ? sprint.todos.sort((a,b)=>a.priority-b.priority):[];
    // const sortedInProgress = sprint ? sprint.inProgress.sort((a,b)=>a.priority-b.priority):[];
    // const sortedInReview = sprint ? sprint.inReview.sort((a,b)=>a.priority-b.priority):[];
    // const sortedDone = sprint ? sprint.done.sort((a,b)=>a.priority-b.priority):[];
    const todoIds =sprint ? todos.map(todo => todo._id) :[];
    const inProgressIds =sprint ?  inProgress.map(inPrg => inPrg._id) :[];
    const inReviewIds =sprint ?  inReview.map(inRev => inRev._id) :[];
    const doneIds =sprint ?  done.map(done => done._id):[];
    let todoTasks = {};

    let tasks = {}
    if (sprint){
        todos.map(todo => {
            tasks = {
                ...tasks,
                [todo._id]:todo
            }
        });
        console.log(todoTasks)
        inProgress.map(inPrg => {
            tasks = {
                ...tasks,
                [inPrg._id]:inPrg
            }
        })
        inReview.map(inRev => {
            tasks = {
                ...tasks,
                [inRev._id]:inRev
            }
        })
        done.map(done => {
            tasks = {
                ...tasks,
                [done._id]:done
            }
        })
        // sprint.todos.map(todo => {
        //     tasks = {
        //         ...tasks,
        //         [todo._id]:todo
        //     }
        // })
        // sprint.inProgress.map(inPrg => {
        //     tasks = {
        //         ...tasks,
        //         [inPrg._id]:inPrg
        //     }
        // })
        // sprint.inReview.map(inRev => {
        //     tasks = {
        //         ...tasks,
        //         [inRev._id]:inRev
        //     }
        // })
        // sprint.done.map(done => {
        //     tasks = {
        //         ...tasks,
        //         [done._id]:done
        //     }
        // })
    }
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
    };
    return data;

};
export const getScheduleSprint = sprint =>{
    sprint.map(spr =>{
        if (!moment(Date.now()).isBefore(spr.endDate)){
            return false;
        }
    });
    return true
};

export const formatRoadmapSprintData = details =>{
    let sprintData = details.sprint.map(spr => {
        const todos = spr.tasks.filter(task => task.status === 'todo').length;
        const inProgress = spr.tasks.filter(task => task.status === 'inProgress').length;
        const inReview = spr.tasks.filter(task => task.status === 'inReview').length;
        const done = spr.tasks.filter(task => task.status === 'done').length;
        const total = todos + inProgress + inReview + done;
        const percentage = parseFloat(((done / total) * 100).toFixed(2))
        return [spr._id,spr.name,new Date(spr.startDate), new Date(spr.endDate),null,percentage,null]
    });
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

    return {data,sprintData}
};
