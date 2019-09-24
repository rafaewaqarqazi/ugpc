import React, {useContext, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {
    Button,
    IconButton,
    Divider,
    Typography,
    Grid, Tooltip, Zoom, Hidden, Dialog, DialogContent, DialogTitle,
     DialogActions, TextField, FormControl, InputLabel, Select, OutlinedInput, MenuItem
} from "@material-ui/core";
import {Add,Close} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import CreateTaskDialog from "./CreateTaskDialog";
import RenderBacklogTaskItem from "./RenderBacklogTaskItem";
import {formatBacklog} from "../../coordinator/presentations/formatData";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import ProjectContext from '../../../context/project/project-context';
import RenderTaskDetails from "../common/RenderTaskDetails";

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
        flexGrow:1,
        marginTop:theme.spacing(2)
    },
    detailsContainer:{
        minHeight:150,

        marginTop:theme.spacing(2)
    },

    detailsHeader:{
        display:'flex',
        marginBottom:theme.spacing(2)
    },
}));

const ListBacklog = ({backlog}) => {
    const projectContext = useContext(ProjectContext)
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
    const [nameError,setNameError] = useState({
        show:false,
        message:''
    })
    const [data,setData] = useState({
        name:'',
        duration:'2'
    });
    const handleChangeData = event => {
        setNameError({
            show:false,
            message:''
        })
        setData({
            ...data,
            [event.target.name]:event.target.value
        })
    }
    useEffect(()=>{
        setState(formatBacklog(backlog));
        setLoading(false)
    },[backlog])
    const handleOpenDetails = detail => {
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

        }
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
        setOpenDetails(false)
        setDetails({});
    };
    const isValid = (name)=>{
        if (name.length <=4 || name.length >=50){
            setNameError({
                show:true,
                message:'Name should be between 5-50 Chars'
            })
            return false
        }
        return true
    }
    const handlePlanSprint = ()=>{
        if (isValid(data.name)){
            const sprintData = {
                name:data.name,
                startDate:selectedDate,
                endDate,
                projectId:projectContext.project.project._id,
                tasksIds:finalIds
            };
            projectContext.planSprint(sprintData)
                .then(result =>{
                    setOpenPlanSprintDialog(false)
                })
        }
        console.log(finalIds)
    };
    const changeDate = (date)=>{
        console.log(date)
        handleDateChange(date);
        handleEndDateChange(moment(date).add(data.duration,'w'))
    }
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
                                            <Typography variant='caption' color='textSecondary' className={classes.title}>{`${column.tasksIds.length} issues`}</Typography>
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
                                    <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                                        <IconButton size='small' onClick={closeDetails}>
                                            <Close/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {
                                    openDetails &&
                                    <RenderTaskDetails details={details}/>
                                }
                            </div>
                        }
                    </Hidden>
                </Grid>
            </Grid>
        </DragDropContext>
            <Hidden smUp>
                <Dialog fullScreen style={{marginTop:48,marginBottom:48}} open={openDetails} onClose={closeDetails}>
                    <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                        <Typography variant='h6' noWrap style={{flexGrow:1}}>{details.title}</Typography>
                        <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                            <IconButton size='small' onClick={closeDetails}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent dividers>
                        {
                            openDetails &&
                            <RenderTaskDetails details={details}/>
                        }

                    </DialogContent>
                </Dialog>
            </Hidden>
            <Dialog open={openPlanSprintDialog} onClose={()=>setOpenPlanSprintDialog(false)} fullWidth maxWidth='xs'>
                <DialogTitle>Start Sprint</DialogTitle>
                <DialogContent>
                    <TextField
                        label='Sprint Name'
                        margin='dense'
                        fullWidth
                        required
                        variant='outlined'
                        name='name'
                        value={data.name}
                        onChange={handleChangeData}
                        error={nameError.show}
                        helperText={nameError.message}
                    />
                    <FormControl fullWidth variant="outlined" margin='dense'>
                        <InputLabel htmlFor="duration">
                            Duration
                        </InputLabel>
                        <Select
                            value={data.duration}
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
                    <Button variant='contained' onClick={()=>setOpenPlanSprintDialog(false)}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={handlePlanSprint}>Add</Button>
                </DialogActions>
            </Dialog>
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