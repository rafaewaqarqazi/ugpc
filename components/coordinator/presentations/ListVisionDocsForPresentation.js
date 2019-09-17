import React, {Fragment, useEffect, useState, useContext} from 'react';
import {ScheduleOutlined} from "@material-ui/icons";
import {
    Divider,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio
} from "@material-ui/core";
import {ExpandLess,ExpandMore, LocationOnOutlined, MeetingRoomOutlined} from '@material-ui/icons'
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {makeStyles} from "@material-ui/styles";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {formatData} from "./formatData";
import VisionDocDetailsDialog from "../../visionDocument/higherAuthority/list/VisionDocDetailsDialog";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import VisionDocsContext from '../../../context/visionDocs/visionDocs-context';
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {RenderListItemContent} from "../../visionDocument/common/RenderListItemContent";
import {getClassRooms, getLabs, getOtherRooms} from "./rooms";

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
        textAlign:'center'
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
    list:{
        overflow: 'auto',
        maxHeight: 300,
        width:'100%'
    },
    mainList:{
        overflow: 'auto',
        maxHeight: 400,
        width:'100%'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    nestedList: {
        paddingLeft: theme.spacing(6),

    },
}));


const ListVisionDocsForPresentation = ({docs}) => {
    const classes = useListContainerStyles();
    const visionDocsContext = useContext(VisionDocsContext);
    const presentationClasses = useStyles();
    const [state,setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentDocument,setCurrentDocument] = useState({});
    const [open,setOpen] = useState(false);
    const [selectedDate, handleDateChange] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogLoading,setDialogLoading]=useState(false);
    const [finalIds,setFinalIds] = useState([]);
    const [openSnackBar,setOpenSnackbar] = useState(false);
    const [openList,setOpenList] = useState(false);
    const [openClassRooms,setOpenClassRooms] = useState(false);
    const [openOtherRooms,setOpenOtherRooms] = useState(false);
    const [openLabs,setOpenLabs] = useState(false);
    const [venue,setVenue] = useState('Seminar Room');
    const handleCloseDialog = ()=>{
        setDialogOpen(false)
    }
    const handleClose = ()=>{
        setOpen(false)
        setCurrentDocument({})
    };
    const openDetails = details =>{
        setCurrentDocument(details);

        setOpen(true);
    };
    useEffect(()=>{
        setState(formatData(docs));
        setLoading(false)
    },[]);
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
            projectsIds: startTaskIds
        };
        const finishTaskIds = Array.from(finish.projectsIds);
        finishTaskIds.splice(destination.index,0,draggableId);
        setFinalIds(finishTaskIds);
        const newFinish = {
            ...finish,
            projectsIds:finishTaskIds,
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
    const getListStyle = isDraggingOver=>({
        backgroundColor: isDraggingOver ? '#C5E1A5' :'#fff'
    });
    const handleCancel = ()=>{
        setState(formatData(docs));
    };
    const handleSchedule = ()=>{
        setDialogLoading(true);
        const visionIds = finalIds.map(projectId => state.projects[projectId].documentation.visionDocument._id );
        console.log(visionIds);
        const data = {
            projectIds:finalIds,
            visionDocsIds:visionIds,
            date:selectedDate,
            venue
        }
        console.log(visionDocsContext)
        visionDocsContext.scheduleVisionDefence(data)
            .then(res => {
                setOpenSnackbar(true);
                setTimeout(()=>{
                    visionDocsContext.fetchByCommittee();
                },2000);

                setDialogOpen(false);
                setDialogLoading(false);


            })
    }
    const handleSnackbarClose = ()=>{
        setOpenSnackbar(false);
    }
    return (
        <Fragment>
            <SuccessSnackBar open={openSnackBar} handleClose={handleSnackbarClose} message={'Meeting Scheduled'}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox}>
                            <ScheduleOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle}>
                            <Typography variant='h5' >Presentations</Typography>
                        </div>
                    </div>
                    <Divider/>

                    {
                        !loading &&
                        state.columnOrder.map(columnId => {
                            const column = state.columns[columnId];
                            const projects = column.projectsIds.map(projectId => state.projects[projectId]);
                            const disabledButton = column.projectsIds.length <= 0;
                            return (
                                <div key={column.id}>
                                    <div className={presentationClasses.scheduleActions}>
                                        <Typography variant='subtitle1' className={presentationClasses.presentationTitle}>{column.title}</Typography>
                                        {
                                            column.title==='Schedule Presentations' &&
                                                <>
                                                    <Button
                                                        variant='outlined'
                                                        style={{borderRadius:0}}
                                                        disabled={disabledButton}
                                                        onClick={handleCancel}
                                                        size='small'
                                                    >
                                                        Cancel
                                                    </Button>


                                                    <Button
                                                        variant='contained'
                                                        style={{marginLeft:5,borderRadius:0}}
                                                        color='secondary' size='small'
                                                        disabled={disabledButton}
                                                        onClick={()=>setDialogOpen(true)}
                                                    >
                                                        Schedule Now
                                                    </Button>
                                                </>
                                        }
                                    </div>
                                    <Divider/>
                                    <Droppable droppableId={column.id}>
                                        {
                                            (provided, snapShot) =>{
                                                if (column.title === 'Schedule Presentations' && column.projectsIds.length === 0){

                                                    return(
                                                    <div
                                                        className={presentationClasses.scheduleContainer}
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapShot.isDraggingOver)}
                                                    >
                                                        <div className={presentationClasses.emptySchedule}>
                                                            <Typography variant='subtitle2' color='textSecondary'>
                                                                Drag and drop Projects from list given below
                                                            </Typography>
                                                        </div>
                                                        {provided.placeholder}
                                                    </div>
                                                    )
                                                }else{
                                                    if (column.projectsIds.length === 0){
                                                        return(
                                                            <div
                                                                className={presentationClasses.scheduleContainer}
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <div className={presentationClasses.emptySchedule}>
                                                                    <Typography variant='subtitle2' color='textSecondary'>
                                                                        No Documents Yet to Schedule Presentation
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
                                                                {projects.map((project,index )=>
                                                                    <div key={project._id}>
                                                                        <Draggable draggableId={project._id} index={index}>
                                                                            {
                                                                                (provided) =>(
                                                                                    <>
                                                                                        <div
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            ref={provided.innerRef}
                                                                                        >
                                                                                            <div onClick={()=>openDetails(project)}>
                                                                                                <RenderListItemContent
                                                                                                    doc={project.documentation.visionDocument}
                                                                                                    project={project}
                                                                                                    />
                                                                                            </div>

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
                    {
                        open &&
                        <VisionDocDetailsDialog
                            open={open}
                            handleClose={handleClose}
                            currentDocument={currentDocument}
                            setCurrentDocument={setCurrentDocument}
                        />
                    }
                </div>

            </DragDropContext>
            <Dialog
                fullWidth
                maxWidth='sm'
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="title"
                aria-describedby="description">
                {
                    dialogLoading && <LinearProgress color='secondary'/>
                }
                <DialogTitle id="title">Select Venue & Data</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <List className={presentationClasses.mainList}>
                                <ListItem button onClick={()=>setOpenList(!openList)}>
                                    <ListItemIcon>
                                        <LocationOnOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary="Show Venues" />
                                    {openList ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openList} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem button onClick={()=>setOpenClassRooms(!openClassRooms)} className={presentationClasses.nested}>
                                            <ListItemIcon>
                                                <MeetingRoomOutlined/>
                                            </ListItemIcon>
                                            <ListItemText primary="Class Rooms" />
                                            {openClassRooms ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={openClassRooms} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding className={presentationClasses.list}>
                                                <FormControl component="fieldset" style={{width:'100%'}}>
                                                    <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                                        {
                                                            getClassRooms().map((classRoom,index) => (
                                                                <ListItem key={index} button className={presentationClasses.nestedList}>
                                                                    <FormControlLabel  value={classRoom} control={<Radio />} label={classRoom} />
                                                                </ListItem>
                                                            ))
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </List>
                                        </Collapse>

                                        <ListItem button onClick={()=>setOpenLabs(!openLabs)} className={presentationClasses.nested}>
                                            <ListItemIcon>
                                                <MeetingRoomOutlined/>
                                            </ListItemIcon>
                                            <ListItemText primary="Labs" />
                                            {openLabs ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={openLabs} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding className={presentationClasses.list}>
                                                <FormControl component="fieldset" style={{width:'100%'}}>
                                                    <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                                        {
                                                            getLabs().map((lab,index) => (
                                                                <ListItem key={index} button className={presentationClasses.nestedList}>
                                                                    <FormControlLabel  value={lab} control={<Radio />} label={lab} />
                                                                </ListItem>
                                                            ))
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </List>
                                        </Collapse>

                                        <ListItem button onClick={()=>setOpenOtherRooms(!openOtherRooms)} className={presentationClasses.nested}>
                                            <ListItemIcon>
                                                <MeetingRoomOutlined/>
                                            </ListItemIcon>
                                            <ListItemText primary="Other Rooms" />
                                            {openOtherRooms ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={openOtherRooms} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding className={presentationClasses.list}>
                                                <FormControl component="fieldset" style={{width:'100%'}}>
                                                    <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                                        {
                                                            getOtherRooms().map((other,index) => (
                                                                <ListItem key={index} button className={presentationClasses.nestedList}>
                                                                    <FormControlLabel  value={other} control={<Radio />} label={other} />
                                                                </ListItem>
                                                            ))
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </List>
                                        </Collapse>
                                    </List>
                                </Collapse>
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                                <DateTimePicker
                                    label="Select Date&Time"
                                    inputVariant="outlined"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    disablePast
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button  color="primary" autoFocus onClick={handleSchedule}>
                        Schedule
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ListVisionDocsForPresentation;