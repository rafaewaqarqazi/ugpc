import React, {useContext, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {
    Button,
    IconButton,
    Divider,
    Typography,
    Grid, Tooltip, Zoom, Hidden, Dialog, DialogContent,
    DialogActions, FormControl, InputLabel, Select, OutlinedInput, MenuItem, DialogContentText
} from "@material-ui/core";
import {Add,Close,Delete} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import CreateTaskDialog from "./CreateTaskDialog";
import RenderBacklogTaskItem from "./RenderBacklogTaskItem";
import {formatBacklog} from "../../coordinator/presentations/formatData";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import ProjectContext from '../../../context/project/project-context';
import UserContext from '../../../context/user/user-context';
import RenderTaskDetails from "../common/RenderTaskDetails";
import DialogTitleComponent from "../../DialogTitleComponent";

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
        flexGrow:1,
        marginLeft:theme.spacing(1)
    },
    listContainer:{
        display:'flex',
        flexDirection: 'column',
        padding:theme.spacing(2),
        border:'1px solid lightgrey',
        borderRadius: 5,
        minHeight:150,

        marginTop:theme.spacing(2)
    },
    detailsContainer:{
        minHeight:150,
        maxHeight:650,
        overflowY:'auto',
        marginTop:theme.spacing(2)
    },

    detailsHeader:{
        display:'flex',
        marginBottom:theme.spacing(2)
    },
}));

const ListBacklog = ({backlog}) => {
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [state,setState] = useState({});
    const classes = useStyles();
    const [loading,setLoading] = useState(true);
    const [openPlanSprintDialog,setOpenPlanSprintDialog] = useState(false);
    const [finalIds,setFinalIds] = useState([]);
    const [openCreateTask,setOpenCreateTask] = useState(false);
    const [openDetails,setOpenDetails] = useState(false);
    const [selectedDate, handleDateChange] = useState(new Date());
    const [endDate, handleEndDateChange] = useState(moment(selectedDate).add(2,'w'));
    const [details,setDetails]= useState({});
    const [lessWeekConfirmation,setLessWeekConfirmation] = useState(false);
    const [planSprintError,setPlanSprintError] = useState(false);
    const [removeTaskDialog,setRemoveTaskDialog] = useState(false);
    const [duration,setDuration] = useState(2);
    const handleChangeData = event => {
        setDuration(event.target.value)
    };
    useEffect(()=>{
        setState(formatBacklog(backlog));
        setLoading(false)
    },[backlog])
    const handleOpenDetails = (detail) => {
        setDetails(detail);
        setOpenDetails(true);
    };

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
            const newTaskIds = Array.from(start.tasksIds);
            const draggedLoc = state.tasks[newTaskIds[source.index]];
            const droppedLoc = state.tasks[newTaskIds[destination.index]];
            const nextTask = state.tasks[newTaskIds[destination.index + 1]];
            const prevTask = state.tasks[newTaskIds[destination.index - 1]];
            let newPriority = '';
            if(!nextTask){
                newPriority = droppedLoc.priority === '5' ? '5' : (1 + parseInt(droppedLoc.priority)).toString()
            }
            else if (!prevTask){
                newPriority = droppedLoc.priority === '1' ? '1' : (parseInt(droppedLoc.priority) - 1).toString()
            } else if (draggedLoc.priority < droppedLoc.priority){

                if ((parseInt(droppedLoc.priority) - parseInt(prevTask.priority)) === 1){
                    newPriority =  droppedLoc.priority
                }else if ((parseInt(droppedLoc.priority) - parseInt(prevTask.priority)) > 1){
                    newPriority =  droppedLoc.priority
                }
                else if ((parseInt(nextTask.priority) - parseInt(droppedLoc.priority)) > 1){
                    newPriority =  (parseInt(prevTask.priority) + 1).toString()
                }
                else if((parseInt(droppedLoc.priority) === parseInt(prevTask.priority)) && (parseInt(nextTask.priority) - parseInt(droppedLoc.priority) === 1)) {
                    newPriority =   (parseInt(droppedLoc.priority) +1).toString()
                }else if(parseInt(droppedLoc.priority) === parseInt(prevTask.priority) && parseInt(droppedLoc.priority) === parseInt(nextTask.priority) ) {
                    newPriority =   droppedLoc.priority
                }

            }
            else if (draggedLoc.priority > droppedLoc.priority){
                if ((parseInt(droppedLoc.priority) - parseInt(prevTask.priority)) === 1){
                    newPriority =  prevTask.priority
                }else if ((parseInt(droppedLoc.priority) - parseInt(prevTask.priority)) > 1){
                    newPriority =  (parseInt(prevTask.priority) + 1).toString()
                } else {
                    newPriority =  droppedLoc.priority;
                }

            }
            else if (draggedLoc.priority === droppedLoc.priority){
                newTaskIds.splice(source.index,1);
                newTaskIds.splice(destination.index,0,draggableId);
                const newColumn={
                    ...start,
                    tasksIds: newTaskIds
                };

                const newState = {
                    ...state,
                    columns:{
                        ...state.columns,
                        [newColumn.id]:newColumn
                    }
                };

                setState(newState);

                return;
            }
            const task = state.tasks[newTaskIds[source.index]];
            const data = {
                taskId:task._id,
                projectId:projectContext.project.project._id,
                priority:newPriority
            };
            projectContext.changePriorityDnD(data)
                .then(result =>{
                    return;
                })
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

        };
        setState(newState);
    };
    const handleCreateTaskClose = ()=>{
        setOpenCreateTask(false)
    };
    const handleCancelSprint = ()=>{
        setState(formatBacklog(backlog))
    };
    const getListStyle = isDraggingOver=>({
        backgroundColor: isDraggingOver ? '#C5E1A5' :'#fff'
    });
    const closeDetails = ()=>{
        setOpenDetails(false);
        setDetails({});
    };
    const handlePlanSprint = ()=>{

        if (getEstimatedWeeks() > 4){
            setPlanSprintError(true);
            return;
        }else if (getEstimatedWeeks() < parseInt(duration)){
            setLessWeekConfirmation(true);
            return;
        }
       continuePlanSprint()

    };
    const continuePlanSprint = ()=>{
        const sprintData = {
            name:`SPR-${projectContext.project.project.details.sprint.length + 1}`,
            startDate:selectedDate,
            endDate,
            projectId:projectContext.project.project._id,
            tasksIds:finalIds
        };
        projectContext.planSprint(sprintData)
            .then(result =>{

                setOpenPlanSprintDialog(false);
                setLessWeekConfirmation(false);

            })
    };
    const getEstimatedWeeks = ()=>{
        const tasks = finalIds.map(id => state.tasks[id]);
        let totalStoryPoints =0;
        tasks.map(task => {
            totalStoryPoints+=parseInt(task.storyPoints)
        });
        const days = Math.ceil(totalStoryPoints/8);

        return Math.ceil(days/7)
    };
    const changeDate = (date)=>{
        handleDateChange(date);
        handleEndDateChange(moment(date).add(duration,'w'))
    };
    const handleCancelPlanSprint = ()=>{
        setOpenPlanSprintDialog(false);
        setDuration(2)
    };
    const handleRemoveTask = ()=>{
        const data = {
            projectId:projectContext.project.project._id,
            taskId:details._id
        };
        projectContext.removeTask(data)
            .then(result =>{
                setRemoveTaskDialog(false);
                setOpenDetails(false);
                setDetails({});
            })
            .catch(error => console.log(error.message))
    };
    return (

        !loading &&
        <div>
        <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={openDetails ? 6 : 12}>

                        {
                            state.columnOrder.map(columnId => {
                                const column = state.columns[columnId];
                                const tasks = column.tasksIds.map(taskId => state.tasks[taskId]);
                                const disabledButton = column.tasksIds.length <= 0;
                                return (
                                    <div key={column.id}>
                                        <div className={classes.actions}>
                                            <Typography variant='subtitle1' >{column.title}</Typography>
                                            <Typography variant='caption' color='textSecondary' className={classes.title}>{`${column.tasksIds.length} tasks`}</Typography>
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
                                                        onClick={()=>setOpenPlanSprintDialog(true)}
                                                    >
                                                        Plan Sprint
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
                                                                <>
                                                                    <div
                                                                        {...provided.droppableProps}
                                                                        ref={provided.innerRef}
                                                                        className={classes.listContainer}
                                                                    >
                                                                        {tasks.map((task,index )=>
                                                                            <div key={task._id} >
                                                                                <Draggable draggableId={task._id} index={index}>
                                                                                    {
                                                                                        (provided) =>(
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
                                                                </>
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


                </Grid>
                <Grid item sm={openDetails ? 6 : false}>
                    <Hidden xsDown>
                        {
                            openDetails &&
                            <div  className={classes.detailsContainer}>
                                <div className={classes.detailsHeader}>
                                    <Tooltip  title='Title' placement="top-start" TransitionComponent={Zoom}>
                                        <Typography variant='h6' noWrap style={{flexGrow:1}}>{details.title}</Typography>
                                    </Tooltip>
                                    <Tooltip  title='Remove Task' placement="top" TransitionComponent={Zoom}>
                                        <div>
                                            <IconButton size='small' disabled={details.createdBy.role !== userContext.user.user.role} onClick={()=>setRemoveTaskDialog(true)}>
                                                <Delete color={(details.createdBy.role === userContext.user.user.role) ? 'error' : 'disabled' }/>
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                    <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                                        <IconButton size='small' onClick={closeDetails}>
                                            <Close/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {
                                    openDetails &&
                                    <RenderTaskDetails details={details} taskIn='Backlog' setDetails={setDetails}/>
                                }
                            </div>
                        }
                    </Hidden>
                </Grid>
            </Grid>
        </DragDropContext>
            <Hidden smUp>
                {
                    openDetails &&
                    <Dialog fullScreen style={{marginTop:48,marginBottom:48}} open={openDetails} onClose={closeDetails}>
                        <DialogTitleComponent title={details.title} handleClose={closeDetails}/>
                        <DialogContent dividers>
                            <RenderTaskDetails details={details} taskIn='Backlog' setDetails={setDetails}/>
                        </DialogContent>
                    </Dialog>
                }

            </Hidden>
            {
                openPlanSprintDialog &&
                <Dialog open={openPlanSprintDialog} onClose={()=>setOpenPlanSprintDialog(false)} fullWidth maxWidth='xs'>
                    <DialogTitleComponent title={'Plan Sprint'} handleClose={()=>setOpenPlanSprintDialog(false)}/>
                    <DialogContent dividers>
                        <div>
                            <Typography component='span' variant='caption'>Suggested Weeks: </Typography>
                            <Typography component='span' variant='subtitle1'>{getEstimatedWeeks()}</Typography>
                        </div>
                        <div>
                            <Typography component='span' variant='caption'>Sprint Name: </Typography>
                            <Typography component='span' variant='subtitle1'>{`SPR-${projectContext.project.project.details.sprint.length + 1}`}</Typography>
                        </div>
                        {
                            planSprintError &&
                            <Typography
                                variant='caption'
                                color='error'
                                style={{textAlign:"center"}}
                            >
                                Tasks in sprint require more time to complete please remove some tasks and try again
                            </Typography>
                        }
                        <FormControl fullWidth variant="outlined" margin='dense'>
                            <InputLabel htmlFor="duration">
                                Duration
                            </InputLabel>
                            <Select
                                value={duration}
                                onChange={handleChangeData}
                                input={<OutlinedInput labelWidth={60} name="duration" id="duration" />}
                            >
                                <MenuItem value='2'>2 Weeks</MenuItem>
                                <MenuItem value='3'>3 Weeks</MenuItem>
                                <MenuItem value='4'>4 Weeks</MenuItem>
                            </Select>
                        </FormControl>
                        <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                            <DatePicker
                                label="Start Date"
                                inputVariant="outlined"
                                value={selectedDate}
                                onChange={changeDate}
                                disablePast
                                margin='dense'
                                fullWidth
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                            <DatePicker
                                label="End Date"
                                inputVariant="outlined"
                                value={endDate}
                                disabled
                                margin='dense'
                                fullWidth

                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={handleCancelPlanSprint}>Cancel</Button>
                        <Button variant='contained' color='secondary' onClick={handlePlanSprint}>Plan</Button>
                    </DialogActions>
                </Dialog>
            }

            {
                lessWeekConfirmation &&
                <Dialog open={lessWeekConfirmation} onClose={()=>setLessWeekConfirmation(false)} fullWidth maxWidth='xs'>
                    <DialogTitleComponent title={'Confirm'} handleClose={()=>setLessWeekConfirmation(false)}/>
                    <DialogContent dividers>
                        <DialogContentText>Tasks in sprint require less time than specified weeks, do you want to continue?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={()=>setLessWeekConfirmation(false)}>Cancel</Button>
                        <Button variant='contained' color='secondary' onClick={continuePlanSprint}>Continue</Button>
                    </DialogActions>
                </Dialog>
            }
            {
                removeTaskDialog &&
                <Dialog open={removeTaskDialog} onClose={()=>setRemoveTaskDialog(false)} fullWidth maxWidth='xs'>
                    <DialogTitleComponent title={'Confirm'} handleClose={()=>setRemoveTaskDialog(false)}/>
                    <DialogContent dividers>
                        <DialogContentText>Are you sure you want to remove this task?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setRemoveTaskDialog(false)}>Cancel</Button>
                        <Button color='primary' onClick={handleRemoveTask}>Remove</Button>
                    </DialogActions>
                </Dialog>
            }

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