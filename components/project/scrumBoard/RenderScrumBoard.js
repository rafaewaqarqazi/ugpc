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
    FormControl, Dialog, DialogTitle, Tooltip, Zoom, IconButton, DialogContent, Hidden
} from "@material-ui/core";

import {makeStyles} from "@material-ui/styles";
import {formatScrumBoard} from "../../coordinator/presentations/formatData";
import RenderSprintTaskItem from "./RenderSprintTaskItem";
import {Close} from "@material-ui/icons";
import RenderTaskDetails from "../common/RenderTaskDetails";
import ProjectContext from '../../../context/project/project-context';
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
        padding:theme.spacing(2),
        border:'1px solid lightgrey',
        borderRadius: 5,
        minHeight:150,
        flexGrow:1,
        marginTop:theme.spacing(2)
    },
    list:{
        marginBottom:theme.spacing(1.5)
    },
    columns:{
        display:'flex',
        flexDirection:'row'
    }
}));

const RenderScrumBoard = ({sprint,sprintNames}) => {
    const projectContext = useContext(ProjectContext);
    const [state,setState] = useState({});
    const classes = useStyles();
    const [selectedSprint,setSelectedSprint] = useState(sprintNames.length === 0 ? 'No Sprint Created' :sprintNames[0])
    const [loading,setLoading] = useState(true);
    const [finalIds,setFinalIds] = useState([]);
    const [openDetails,setOpenDetails] = useState(false);
    const [details,setDetails]= useState({});
    useEffect(()=>{
        const data = sprint;
        const filter = data.filter(d => d.name === selectedSprint)[0]
        setState(formatScrumBoard(filter));
        setLoading(false)
    },[sprint]);
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
            // const existingColumn = start.id;
            // const newColumn = finish.id;
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
                projectId:projectContext.project.project[0]._id
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
        setSelectedSprint(event.target.value)
        const data = sprint;
        const filter = data.filter(d => d.name === event.target.value)[0]
        setState(formatScrumBoard(filter));
    }
    return (
        !loading &&
        <div>
            <FormControl variant="outlined" margin='dense' style={{marginBottom:20}}>
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
                        <RenderTaskDetails details={details}/>
                    }

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RenderScrumBoard;