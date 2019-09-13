import React, { useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {
    Button,
    IconButton,
    Divider,
    Typography,
    Grid, Tooltip, Zoom,
} from "@material-ui/core";
import {Add,Close} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import CreateTaskDialog from "./CreateTaskDialog";
import RenderBacklogTaskItem from "./RenderBacklogTaskItem";
import {formatBacklog} from "../../coordinator/presentations/formatData";
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
    detailsContainer:{
        minHeight:150,

        marginTop:theme.spacing(2)
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
    detailsHeader:{
        display:'flex'
    }
}));

const ListBacklog = ({backlog,data}) => {
    const [state,setState] = useState(backlog);
    const classes = useStyles();
    const [finalIds,setFinalIds] = useState([]);
    const [openCreateTask,setOpenCreateTask] = useState(false);
    const [openDetails,setOpenDetails] = useState(false);
    const [details,setDetails]= useState({});

    const handleOpenDetails = detail => {
        setDetails(detail);
        setOpenDetails(true)
    }
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
        const startTaskIds = Array.from(start.tasksIds);
        startTaskIds.splice(source.index,1);
        const newStart = {
            ...start,
            tasksIds: startTaskIds
        };
        const finishTaskIds = Array.from(finish.tasksIds);
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
    };
    const handleCancelSprint = ()=>{
        setState(formatBacklog(data))
    };
    const getListStyle = isDraggingOver=>({
        backgroundColor: isDraggingOver ? '#C5E1A5' :'#fff'
    });
    const closeDetails = ()=>{
        setOpenDetails(false)
        setDetails({});
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
                                            onClick={handleCancelSprint}
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
                                    column.title==='Backlog' &&
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
                                                    style={getListStyle(snapShot.isDraggingOver)}
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
                                                    <Grid container spacing={1}>

                                                        <Grid item xs={openDetails ? false : 12} sm={openDetails ? 6 : 12}>
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className={classes.listContainer}
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
                                                                                            onClick={()=>handleOpenDetails(task)}
                                                                                        >

                                                                                            <RenderBacklogTaskItem task={task}/>
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
                                                        </Grid>
                                                        {
                                                            openDetails &&
                                                            <Grid item xs={openDetails ? 12 : false} sm={openDetails ? 6 : false}>
                                                                <div  className={classes.detailsContainer}>
                                                                    <div className={classes.detailsHeader}>
                                                                        <Tooltip  title='Title' placement="top-start" TransitionComponent={Zoom}>
                                                                            <Typography variant='h6' style={{flexGrow:1}}>{details.title}</Typography>
                                                                        </Tooltip>
                                                                        <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                                                                            <IconButton size='small' onClick={closeDetails}>
                                                                                <Close/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        }


                                                    </Grid>

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

export default ListBacklog;