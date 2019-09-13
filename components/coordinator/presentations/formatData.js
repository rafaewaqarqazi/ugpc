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
