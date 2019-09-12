import React, { useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {Button, Divider, Typography, Grid} from "@material-ui/core";

import {makeStyles} from "@material-ui/styles";
const useStyles = makeStyles(theme =>({
    scheduleContainer:{
        border:'1.7px dashed grey',
        marginTop:theme.spacing(2),
        borderRadius:5
    },
    emptySchedule:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:theme.spacing(5),
        textAlign:'center',
        height:theme.spacing(20)
    },
    scheduleActions:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'stretch',
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            padding: theme.spacing(1),
            marginTop: theme.spacing(2),

        }
    },
    presentationTitle:{
        flexGrow:1
    },
    listContainer:{
        display:'flex',
        flexDirection: 'column',
        padding:theme.spacing(2),
        border:'1px solid lightgrey',
        borderRadius: 5,
        minHeight:150,
        flexGrow:1,
        marginTop:theme.spacing(2)
    },
    list:{

    },
    listItem:{
        backgroundColor:'rgba(255,255,255,0.5)',
        borderLeft:'4px solid #F57F17',
        padding:theme.spacing(1.2),
        '&:hover':{
            boxShadow:theme.shadows[6]
        },
        display:'flex',
        borderRadius:2,
        alignItems:'center'
    },
    columns:{
        display:'flex',
        flexDirection:'row'
    }
}));

const RenderScrumBoard = ({sprint}) => {
    const [state,setState] = useState(sprint);
    const presentationClasses = useStyles();
    const [finalIds,setFinalIds] = useState([]);
    const onDragEnd= result=>{
        const { destination, source, draggableId } = result;
        if (!destination){
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index){
            return;
        }

        const start = state.columns[source.droppableId];
        const finish = state.columns[destination.droppableId];
        if (start === finish){
            return;
        }
        const startTaskIds = Array.from(start.projectsIds);
        startTaskIds.splice(source.index,1);
        const newStart = {
            ...start,
            tasksIds: startTaskIds
        };
        const finishTaskIds = Array.from(finish.projectsIds);
        finishTaskIds.splice(destination.index,0,draggableId);
        setFinalIds(finishTaskIds);
        const newFinish = {
            ...finish,
            tasksIds:finishTaskIds,
        };
        const newState = {
            ...state,
            columns:{
                ...state.columns,
                [newStart.id]:newStart,
                [newFinish.id]:newFinish
            }

        }
        setState(newState);
    };
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={1}>
                    {
                        state.columnOrder.map(columnId => {
                            const column = state.columns[columnId];
                            const tasks = column.tasksIds.map(taskId => state.tasks[taskId]);
                            return (
                                <Grid item xs={6} sm={3} key={column.id} >
                                    <Typography variant='subtitle1' className={presentationClasses.presentationTitle}>{column.title}</Typography>
                                    <Divider/>
                                    <Droppable droppableId={column.id}>
                                        {
                                            (provided, snapShot) =>{
                                                if (column.title === 'Todos' && column.tasksIds.length === 0){

                                                    return(
                                                        <div
                                                            className={presentationClasses.scheduleContainer}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            // style={getListStyle(snapShot.isDraggingOver)}
                                                        >
                                                            <div className={presentationClasses.emptySchedule}>
                                                                <Typography variant='subtitle2' color='textSecondary'>
                                                                    Yeah! No Tasks Todo
                                                                </Typography>
                                                            </div>
                                                            {provided.placeholder}
                                                        </div>
                                                    )
                                                }
                                                else if ((column.title === 'In Progress' || column.title === 'In Review' || column.title === 'Done')  && column.tasksIds.length === 0){

                                                    return(
                                                        <div
                                                            className={presentationClasses.scheduleContainer}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            // style={getListStyle(snapShot.isDraggingOver)}
                                                        >
                                                            <div className={presentationClasses.emptySchedule}>
                                                                <Typography variant='subtitle2' color='textSecondary'>
                                                                    Drag n Drop Tasks from Todos
                                                                </Typography>
                                                            </div>
                                                            {provided.placeholder}
                                                        </div>
                                                    )
                                                }

                                                else{
                                                    if (column.tasksIds.length === 0){
                                                        return(
                                                            <div
                                                                className={presentationClasses.scheduleContainer}
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <div className={presentationClasses.emptySchedule}>
                                                                    <Typography variant='subtitle2' color='textSecondary'>
                                                                        No Tasks Created Yet
                                                                    </Typography>
                                                                </div>
                                                                {provided.placeholder}
                                                            </div>
                                                        )
                                                    }else{
                                                        return (
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className={presentationClasses.listContainer}
                                                            >
                                                                {tasks.map((task,index )=>
                                                                    <div key={task._id} className={presentationClasses.list}>
                                                                        <Draggable draggableId={task._id} index={index}>
                                                                            {
                                                                                (provided, snapShot) =>(
                                                                                    <>
                                                                                        <div
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            ref={provided.innerRef}
                                                                                        >
                                                                                            {/*<div onClick={()=>openDetails(project)}>*/}
                                                                                            {/*    <RenderListItemContent*/}
                                                                                            {/*        doc={project.documentation.visionDocument}*/}
                                                                                            {/*        project={project}*/}
                                                                                            {/*    />*/}
                                                                                            {/*</div>*/}

                                                                                        </div>

                                                                                        <Divider/>
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </Draggable>
                                                                    </div>
                                                                )}
                                                                {provided.placeholder}
                                                            </div>
                                                        )
                                                    }

                                                }
                                            }
                                        }
                                    </Droppable>
                                </Grid>
                            )
                        })
                    }
                </Grid>


            </DragDropContext>
        </div>
    );
};

export default RenderScrumBoard;