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
    console.log(sprint)
    const todoIds = Array.from(sprint.todos.map(todo => todo._id));
    const inProgressIds = Array.from(sprint.inProgress.map(inPrg => inPrg._id));
    const inReviewIds = Array.from(sprint.inReview.map(inRev => inRev._id));
    const doneIds = Array.from(sprint.done.map(done => done._id));
    let tasks = {}
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
    console.log(tasks);

    const data = {
        tasks,
        columns:{
            'column-1':{
                'id':'column-1',
                title:'Todos',
                tasksIds:todoIds
            },
            'column-2':{
                'id':'column-2',
                title:'In Progress',
                tasksIds:inProgressIds
            },
            'column-3':{
                'id':'column-3',
                title:'In Review',
                tasksIds:inReviewIds
            },
            'column-4':{
                'id':'column-4',
                title:'Done',
                tasksIds:doneIds
            },
        },
        columnOrder:['column-1','column-2','column-3','column-4']
    }
    console.log(data)
    return data;
};
