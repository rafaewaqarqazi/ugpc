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

export const formatBacklogs = backlogs => {
    const ids = Array.from(backlogs.map(backlog => backlog._id));
    let tasks = {}
    Array.from(backlogs.map(backlog => backlog._id),(id,index)=>{
        tasks = {
            ...tasks,
            [id]:backlogs[index]
        }
        return tasks
    });
    console.log(tasks);

    const data = {
        backlogs:tasks,
        columns:{
            'column-1':{
                'id':'column-1',
                title:'Create Sprint',
                tasksIds:[]
            },
            'column-2':{
                'id':'column-2',
                title:'Backlogs',
                tasksIds:ids
            },
        },
        columnOrder:['column-1','column-2']
    }
    console.log(data)
    return data;
};

export const formatScrumBoard = sprint => {
    const ids = Array.from(sprint.map(spr => spr._id));
    let tasks = {}
    Array.from(sprint.map(spr => spr._id),(id,index)=>{
        tasks = {
            ...tasks,
            [id]:sprint[index]
        }
        return tasks
    });
    console.log(tasks);

    const data = {
        sprint:tasks,
        columns:{
            'column-1':{
                'id':'column-1',
                title:'Todos',
                tasksIds:ids
            },
            'column-2':{
                'id':'column-2',
                title:'In Progress',
                tasksIds:[]
            },
            'column-3':{
                'id':'column-3',
                title:'In Review',
                tasksIds:[]
            },
            'column-4':{
                'id':'column-4',
                title:'Done',
                tasksIds:[]
            },
        },
        columnOrder:['column-1','column-2','column-3','column-4']
    }
    console.log(data)
    return data;
};
