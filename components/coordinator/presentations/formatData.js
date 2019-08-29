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