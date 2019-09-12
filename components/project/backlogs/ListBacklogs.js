import React, { useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography} from "@material-ui/core";
import {Add} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import CreateTaskDialog from "./CreateTaskDialog";
const useStyles = makeStyles(theme =>({
    backlogContainer:{
        border:'1.7px dashed grey',
        marginTop:theme.spacing(2),
        borderRadius:5
    },
    emptyContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:theme.spacing(5),
        textAlign:'center'
    },
    actions:{
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
    title:{
        flexGrow:1
    },

}));

const ListBacklogs = ({backlogs}) => {
    const [state,setState] = useState(backlogs);
    const classes = useStyles();
    const [finalIds,setFinalIds] = useState([]);
    const [openCreateTask,setOpenCreateTask] = useState(false);
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
    const handleCreateTaskClose = ()=>{
        setOpenCreateTask(false)
    }
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                {
                    state.columnOrder.map(columnId => {
                    const column = state.columns[columnId];
                    const tasks = column.tasksIds.map(taskId => state.tasks[taskId]);
                    const disabledButton = column.tasksIds.length <= 0;
                    return (
                        <div key={column.id}>
                            <div className={classes.actions}>
                                <Typography variant='subtitle1' className={classes.title}>{column.title}</Typography>
                                {
                                    column.title==='Create Sprint' &&
                                    <>
                                        <Button
                                            variant='outlined'
                                            style={{borderRadius:0}}
                                            size='small'
                                            disabled={disabledButton}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant='contained'
                                            style={{marginLeft:5,borderRadius:0}}
                                            color='secondary' size='small'
                                            disabled={disabledButton}
                                        >
                                            Create Sprint
                                        </Button>
                                    </>
                                }
                                {
                                    column.title==='Backlogs' &&
                                        <Button
                                            variant='outlined'
                                            color='secondary'
                                            size='small'
                                            onClick={()=>setOpenCreateTask(true)}
                                        >
                                            <Add style={{fontSize: 20}}/>
                                            Create Task
                                        </Button>
                                }
                            </div>
                            <Divider/>
                            <Droppable droppableId={column.id}>
                                {
                                    (provided, snapShot) =>{
                                        if (column.title === 'Create Sprint' && column.tasksIds.length === 0){

                                            return(
                                                <div
                                                    className={classes.backlogContainer}
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    // style={getListStyle(snapShot.isDraggingOver)}
                                                >
                                                    <div className={classes.emptyContainer}>
                                                        <Typography variant='subtitle2' color='textSecondary'>
                                                            Drag and drop Tasks from list given below
                                                        </Typography>
                                                    </div>
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }else{
                                            if (column.tasksIds.length === 0){
                                                return(
                                                    <div
                                                        className={classes.backlogContainer}
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <div className={classes.emptyContainer}>
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
                                                    >
                                                        {tasks.map((task,index )=>
                                                            <div key={task._id} >
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
                        </div>
                            )
                        })
                  }

            </DragDropContext>
            {
                openCreateTask &&
                <CreateTaskDialog
                    openCreateTask={openCreateTask}
                    handleCreateTaskClose={handleCreateTaskClose}
                />
            }

        </div>
    );
};

export default ListBacklogs;