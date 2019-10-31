import React, {useContext, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {
    Button,
    Divider,
    Typography,
    Grid,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    FormControl, Dialog, DialogTitle, Tooltip, Zoom, IconButton, DialogContent, DialogActions, LinearProgress
} from "@material-ui/core";

import {makeStyles} from "@material-ui/styles";
import {formatScrumBoard} from "../../coordinator/presentations/formatData";
import RenderSprintTaskItem from "./RenderSprintTaskItem";
import {Close} from "@material-ui/icons";
import RenderTaskDetails from "../common/RenderTaskDetails";
import ProjectContext from '../../../context/project/project-context';
import UserContext from '../../../context/user/user-context';
import InfoSnackBar from "../../snakbars/InfoSnackBar";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import moment from "moment";
const useStyles = makeStyles(theme =>({
    container:{
        border:'1.7px dashed grey',
        marginTop:theme.spacing(2),
        borderRadius:5
    },
    emptyContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:theme.spacing(5),
        textAlign:'center',
        height:theme.spacing(20)
    },
    columnHeader:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    count:{
        flexGrow:1,
        marginLeft:theme.spacing(1),

    },
    listContainer:{
        display:'flex',
        flexDirection: 'column',
        padding:theme.spacing(1),
        border:'1px solid lightgrey',
        borderRadius: 5,
        minHeight:150,
        flexGrow:1,
        marginTop:theme.spacing(2),
        maxHeight:650,
        overflowY:'auto',
        backgroundColor:'#ebecf0'
    },
    list:{
        marginBottom:theme.spacing(1)
    },
    columns:{
        display:'flex',
        flexDirection:'row'
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
            justifyContent:'space-between',
            alignItems:'center',
            padding: theme.spacing(1),
            marginTop: theme.spacing(2),

        }
    }
}));

const RenderScrumBoard = ({sprint,sprintNames}) => {
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [state,setState] = useState({});
    const classes = useStyles();
    const [selectedSprint,setSelectedSprint] = useState(sprintNames.length === 0 ? 'No Sprint Created' :sprintNames[0]);
    const [loading,setLoading] = useState(true);
    const [finalIds,setFinalIds] = useState([]);
    const [openInfoSnackBar,setOpenInfoSnackBar] = useState(false);
    const [openDetails,setOpenDetails] = useState(false);
    const [details,setDetails]= useState({});
    const [dates,setDates] = useState({
        startDate:'',
        endDate:''
    })
    const [completeSprintDialog,setCompleteSprintDialog] = useState(false);
    const [openSuccessSnackBar,setOpenSuccessSnackBar] = useState(false);
    const [completeSprintLoading,setCompleteSprintLoading] = useState(false);
    const [sprintTasks,setSprintTasks] = useState({
        completed:0,
        inComplete:0
    });
    const sprintInit = ()=>{
        const filter = sprint.filter(d => d.name === sprintNames[0] && d.status === 'InComplete')[0];
        setSelectedSprint(sprintNames.length === 0 ? 'No Sprint Created' :sprintNames[0]);

        if (sprintNames.length !== 0){
            setDates({
                startDate: filter.startDate,
                endDate: filter.endDate
            });
        }
        setState(formatScrumBoard(filter));
        setLoading(false)
    };
    useEffect(()=>{
       sprintInit()
    },[]);
    const getListStyle = isDraggingOver=>({
        backgroundColor: isDraggingOver ? '#C5E1A5' :'#fff'
    });
    const handleOpenDetails = detail => {
        setDetails(detail);
        setOpenDetails(true);
    };
    const closeDetails = ()=>{
        setOpenDetails(false)
        setDetails({});
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
            return;
        }else{
           const userRole = userContext.user.user.role;
           if (userRole === 'Student' && (start.id === 'todos' || start.id === 'inProgress' || start.id === 'inReview') && finish.id === 'done'){ // inProgress & todos
               setOpenInfoSnackBar(true)
               return;
           }
            const taskIds = Array.from(start.tasksIds);
            const task = state.tasks[taskIds[source.index]];
            const sprintFilter = sprint;
            const sprintId = sprintFilter.filter(f => f.name === selectedSprint)[0]._id;
            const data = {
                existingColumn:start.id,
                newColumn:finish.id,
                task,
                sprintId,
                taskId:task._id,
                projectId:projectContext.project.project._id
            }
            projectContext.changeColumn(data)
                .then(result => {
                    console.log(result)
                })

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
    const handleSelectSprint = event => {
        setSelectedSprint(event.target.value);
        if (event.target.value === 'No Sprint Created'){
            return;
        }
        const data = sprint;
        const filter = data.filter(d => d.name === event.target.value && d.status === 'InComplete')[0];
        setDates({
            startDate: filter.startDate,
            endDate: filter.endDate
        })
        setState(formatScrumBoard(filter));
    };
    const handleCompleteSprint = ()=>{
        const data = sprint;
        const currentSprint = data.filter(d => d.name === selectedSprint)[0];
        const completed = currentSprint.tasks.filter(task => task.status === 'done').length;
        const inComplete = currentSprint.tasks.filter(task => task.status === 'todo').length +currentSprint.tasks.filter(task => task.status === 'inProgress').length + currentSprint.tasks.filter(task => task.status === 'inReview').length;
        setSprintTasks({
            completed,
            inComplete
        });
        setCompleteSprintDialog(true)

    };
    const completeSprint = ()=>{
        setCompleteSprintLoading(true);
        const data = sprint;
        const currentSprint = data.filter(d => d.name === selectedSprint)[0];
        let tasks =currentSprint.tasks.filter(task => task.status !== 'done');
        console.log(tasks)
        const completedData = {
            tasks,
            sprintId:currentSprint._id,
            projectId:projectContext.project.project._id
        };
        projectContext.completeSprint(completedData)
            .then(result =>{
                setCompleteSprintLoading(false);
                setOpenSuccessSnackBar(true);
                setCompleteSprintDialog(false);

            })
            .catch(error => console.log(error))
    };
    const handleCloseSuccess = ()=>{
        setOpenSuccessSnackBar(false);
        sprintInit();
    }
    return (
        !loading &&
        <div>
            <SuccessSnackBar message='Sprint Completed' open={openSuccessSnackBar} handleClose={handleCloseSuccess} />
            <InfoSnackBar message='Only supervisor can move to Done' open={openInfoSnackBar} setOpen={setOpenInfoSnackBar} />
            <div className={classes.actions}>
                <FormControl variant="outlined" margin='dense' style={{minWidth:160}}>
                    <InputLabel htmlFor="sprint">
                        Select Sprint
                    </InputLabel>
                    <Select

                        value={selectedSprint}
                        onChange={handleSelectSprint}
                        input={<OutlinedInput labelWidth={95} name="sprint" id="sprint" />}
                    >
                        {
                            sprintNames.length === 0 &&
                            <MenuItem value='No Sprint Created'>No Sprint Created</MenuItem>
                        }

                        {
                            sprintNames.map((name,index) => (
                                <MenuItem key={index} value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {
                    sprintNames.length !== 0 &&
                    <Typography variant='subtitle1' color='textSecondary'>{`${moment(dates.startDate).format('MMM DD, YYYY')} - ${moment(dates.endDate).format('MMM DD, YYYY')}`}</Typography>
                }
                {
                    sprintNames.length !== 0 &&
                    <Button variant='outlined' color='primary' onClick={handleCompleteSprint}>Complete Sprint</Button>
                }
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={1}>
                    {
                        state.columnOrder.map(columnId => {
                            const column = state.columns[columnId];
                            const tasks = column.tasksIds.map(taskId => state.tasks[taskId]);
                            return (
                                <Grid item xs={6} sm={3} key={column.id} >
                                    <div className={classes.columnHeader}>
                                        <Typography variant='subtitle1' display='inline'>{column.title}</Typography>
                                        <Typography variant='caption' color='textSecondary' className={classes.count}>{column.tasksIds.length}</Typography>
                                    </div>

                                    <Divider/>
                                    <Droppable droppableId={column.id}>
                                        {
                                            (provided, snapShot) =>{
                                                if (column.title === 'Todos' && column.tasksIds.length === 0){

                                                    return(
                                                        <div
                                                            className={classes.container}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={getListStyle(snapShot.isDraggingOver)}
                                                        >
                                                            <div className={classes.emptyContainer}>
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
                                                            className={classes.container}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={getListStyle(snapShot.isDraggingOver)}
                                                        >
                                                            <div className={classes.emptyContainer}>
                                                                <Typography variant='subtitle2' color='textSecondary'>
                                                                    Drag n Drop Tasks here
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
                                                                className={classes.container}
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
                                                                className={classes.listContainer}
                                                            >
                                                                {tasks.map((task,index )=>
                                                                    <div key={task._id} className={classes.list}>
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
                                                                                            <RenderSprintTaskItem task={task}/>

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
            <Dialog fullWidth maxWidth='sm' open={openDetails} onClose={closeDetails}>
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
                        <RenderTaskDetails setDetails={setDetails} details={details} taskIn='ScrumBoard' sprintId={sprint.filter(f => f.name === selectedSprint)[0]._id}/>
                    }

                </DialogContent>
            </Dialog>
            <Dialog fullWidth maxWidth='xs' open={completeSprintDialog} onClose={()=>setCompleteSprintDialog(false)}>
                {completeSprintLoading && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Complete Sprint</Typography>
                    <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=>setCompleteSprintDialog(false)}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <div>
                        <Typography variant='subtitle1' display='inline'>{sprintTasks.completed}</Typography>
                        <Typography variant='body2' display='inline' color='textSecondary' style={{marginLeft:5}}>
                            Tasks were Completed
                        </Typography>
                    </div>
                   <div>
                       <Typography variant='subtitle1' display='inline'>{sprintTasks.inComplete}</Typography>
                       <Typography variant='body2' display='inline' color='textSecondary' style={{marginLeft:5}}>
                           Tasks were incomplete
                       </Typography>
                   </div>
                    {
                        sprintTasks.inComplete > 0 &&
                        <div>
                            <Typography variant='subtitle2' display='inline'>Note:</Typography>
                            <Typography variant='body2' display='inline' color='textSecondary' style={{marginLeft:5}}>
                                InComplete Tasks will be moved to backlog again
                            </Typography>
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setCompleteSprintDialog(false)} variant='contained'>Cancel</Button>
                    <Button variant='outlined' color='secondary' onClick={completeSprint}>Complete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default React.memo(RenderScrumBoard);