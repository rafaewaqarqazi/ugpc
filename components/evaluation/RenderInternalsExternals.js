import React, {useState} from 'react';
import {
    Avatar, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, LinearProgress, ListItemIcon,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TextField,
    Tooltip, Typography,
    Zoom,
    Button, FormControl, InputLabel, Select, OutlinedInput, InputAdornment
} from "@material-ui/core";
import moment from "moment";
import {AssignmentTurnedInOutlined, Close, MoreVertOutlined, PictureAsPdfOutlined, Search} from "@material-ui/icons";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import {makeStyles} from "@material-ui/styles";
import {serverUrl} from "../../utils/config";
import {evaluateInternalExternalAPI, scheduleExternalDateAPI} from "../../utils/apiCalls/projects";
import {changeFinalDocumentationStatusAPI} from "../../utils/apiCalls/users";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import SchedulingDialogContent from "../coordinator/presentations/SchedulingDialogContent";
const useStyles = makeStyles(theme =>({
    tableRow:{
        "&:hover":{

            boxShadow:theme.shadows[6]
        }
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflow:'auto',
        maxHeight:450
    }
}));
const RenderInternalsExternals = ({projects,marks,type,fetchData}) => {
    const projectsClasses = useStyles();
    const classes = useListContainerStyles();
    const [filter,setFilter] = useState(projects);
    const emptyStyles = useListItemStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading,setLoading]= useState({
        evaluation:false,
        schedule:false
    });
    const [filtered,setFiltered] = useState(projects);
    const [department,setDepartment] = useState('All');
    const [venue,setVenue] = useState('Seminar Room');
    const [selectedDate, handleDateChange] = useState(new Date());
    const [success,setSuccess] = useState({
        open:false,
        message:''
    });
    const [data,setData] = useState({
        documentId:'',
        projectId:'',
        marks:0
    });
    const [error,setError] = useState({
        show:false,
        message:''
    });
    const [dialog,setDialog] = useState({
        evaluation:false,
        schedule:false
    });
    const handleClickEvaluate = (documentId,projectId)=>{
        setError({show:false,message:''});
        setData({
            ...data,
            documentId,
            projectId
        });
        setDialog({
            ...dialog,
            evaluation:true
        })
    };
    const handleClickScheduleExternal = (documentId,projectId)=>{
        setError({show:false,message:''});
        setData({
            ...data,
            projectId,
            documentId
        });
        setDialog({
            ...dialog,
            schedule:true
        })
    };
    const handleChangeMarksObtained = event =>{

        if (!event.target.value.match(/^[0-9]*$/)){
            setError({show:true,message:'Only Numbers Allowed'})
        }else {
            setError({show:false,message:''});
            setData({...data,[event.target.name]:event.target.value})
        }
    };
    const handleConfirmEvaluation = ()=>{
        if (data.marks < 0 || data.marks > marks.internal){
            setError({show:true,message:`Provide Marks in 0-${marks.internal} Limit`})
        }else {
            setLoading({
                ...loading,
                evaluation:true
            });
            evaluateInternalExternalAPI({projectId:data.projectId,marks:data.marks,type})
                .then(result =>{
                    if (result.error){
                        console.log(result.error)
                        setLoading({
                            ...loading,
                            evaluation:false
                        });
                        return;
                    }
                    const sData = {
                        projectId:data.projectId,
                        documentId:data.documentId,
                        status:type === 'internal' ? 'Available for External' : 'Completed'
                    };

                    changeFinalDocumentationStatusAPI(sData)
                        .then(res => {
                            if (res.error){
                                console.log(res.error);
                                setLoading({
                                    ...loading,
                                    evaluation:false
                                });
                                setDialog({
                                    ...dialog,
                                    evaluation:false
                                })
                            }
                            setLoading({
                                ...loading,
                                evaluation:false
                            });
                            setDialog({
                                ...dialog,
                                evaluation:false
                            });
                            setSuccess({
                                open:true,
                                message:result.success
                            });
                            fetchData();
                        })
                })
        }
    };
    const handleExternalSchedule = ()=>{
        setLoading({
            ...loading,
            schedule:true
        });
        scheduleExternalDateAPI({venue,selectedDate,projectId:data.projectId})
            .then(result =>{
                if (result.error){
                    console.log(result.error)
                    setLoading({
                        ...loading,
                        schedule:false
                    });
                    return;
                }
                const sData = {
                    projectId:data.projectId,
                    documentId:data.documentId,
                    status:'External Scheduled'
                };

                changeFinalDocumentationStatusAPI(sData)
                    .then(res => {
                        if (res.error){
                            console.log(res.error);
                            setLoading({
                                ...loading,
                                schedule:false
                            });
                            setDialog({
                                ...dialog,
                                schedule:false
                            })
                        }
                        setLoading({
                            ...loading,
                            schedule:false
                        });
                        setDialog({
                            ...dialog,
                            schedule:false
                        });
                        setSuccess({
                            open:true,
                            message:result.success
                        });
                        fetchData();
                    })
            })
    };
    const handleChange = event =>{
        setDepartment(event.target.value);
        switch (event.target.value) {
            case 'All':
                setFilter(projects);
                setFiltered(projects);
                break;
            case event.target.value :
                let data = [];
                projects.map(project => {
                    if(project.department === event.target.value){
                        data=[
                            ...data,
                            project
                        ]
                    }
                });
                setFiltered(data);
                setFilter(data);
                break;
        }
    };
    const handleChangeSearch = e =>{
        const data = filtered;
        setFilter(e.target.value !==''? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : filtered)
    };
    return (
        <div>
            <SuccessSnackBar message={success.message} open={success.open} handleClose={()=>setSuccess({open:false,message:''})}/>
            <div className={classes.listHeader}>
                <FormControl variant="outlined" margin='dense' className={classes.formControl}>
                    <InputLabel htmlFor="department">
                        Department
                    </InputLabel>
                    <Select
                        value={department}
                        onChange={handleChange}
                        input={<OutlinedInput labelWidth={85} name="department" id="department" />}
                    >
                        <MenuItem value='All'>All</MenuItem>
                        <MenuItem value='BSSE'>BSSE</MenuItem>
                        <MenuItem value='BSCS'>BSCS</MenuItem>
                        <MenuItem value='BSIT'>BSIT</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    variant="outlined"
                    label="Search"
                    name='search'
                    margin='dense'
                    placeholder='Search For Projects'
                    onChange={handleChangeSearch}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            {
                <div className={projectsClasses.tableWrapper}>

                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Title</TableCell>
                                <TableCell align="left">Department</TableCell>
                                <TableCell align="left">Students</TableCell>
                                <TableCell align="left">Supervisor</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Document</TableCell>
                                <TableCell align="left">Marks</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                filter.length === 0  ?
                                    <TableRow>
                                        <TableCell colSpan={9}>
                                            <div className={emptyStyles.emptyListContainer}>
                                                <div className={emptyStyles.emptyList}>
                                                    No Projects Found
                                                </div>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                    :
                                filter.map((project,index) => (
                                    <Tooltip key={index} title='Click to view Details' placement="top-start" TransitionComponent={Zoom}>
                                        <TableRow className={projectsClasses.tableRow} >
                                            <TableCell align="left" >{project.documentation.visionDocument.title}</TableCell>
                                            <TableCell align="left" >{project.department}</TableCell>
                                            <TableCell style={{display:'flex'}}>
                                                {
                                                    project.students.map((student,index) =>
                                                        <Tooltip key={index} title={student.student_details.regNo} placement='top'>
                                                            <Avatar className={emptyStyles.avatar}>
                                                                {
                                                                    student.name.charAt(0).toUpperCase()
                                                                }
                                                            </Avatar>
                                                        </Tooltip>
                                                    )
                                                }
                                            </TableCell>
                                            <Tooltip  title={project.details.supervisor.supervisor_details.position} placement="top" TransitionComponent={Zoom}>
                                                <TableCell align="left" style={{textTransform:'capitalize'}}>{project.details.supervisor.name}</TableCell>
                                            </Tooltip>
                                            <TableCell align="left">{project.documentation.finalDocumentation.status}</TableCell>
                                            <TableCell align="left">{
                                                type === 'internal' ?
                                                project.details.internal.date ? moment(project.details.internal.date).format('LLL')  : 'Not Assigned'
                                                    :
                                                    project.details.external.date ? moment(project.details.external.date).format('LLL')  : 'Not Assigned'
                                            }</TableCell>
                                            <TableCell align="left">
                                                <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                    <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${project.documentation.finalDocumentation.document.filename}`} target="_blank" >
                                                        <PictureAsPdfOutlined />
                                                    </a>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="left">{
                                                type === 'internal' ?
                                                project.details.marks.internal ? project.details.marks.internal  : 'Not Assigned'
                                                    :
                                                project.details.marks.external ? project.details.marks.external  : 'Not Assigned'
                                            }</TableCell>
                                            <TableCell align="left">
                                                <Tooltip title='Click for Actions' placement='top'>
                                                    <IconButton size='small' onClick={(event)=>setAnchorEl(event.currentTarget)}>
                                                        <MoreVertOutlined/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={()=>setAnchorEl(null)}
                                                >
                                                    {
                                                        project.documentation.finalDocumentation.status === 'Internal Scheduled' && type === 'internal' &&
                                                        <MenuItem onClick={()=>handleClickEvaluate(project.documentation.finalDocumentation._id,project._id)}>
                                                            <ListItemIcon>
                                                                <AssignmentTurnedInOutlined />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit" noWrap>
                                                                Evaluate
                                                            </Typography>
                                                        </MenuItem>
                                                    }
                                                    {
                                                        project.documentation.finalDocumentation.status === 'External Assigned' && type === 'external' &&
                                                        <MenuItem onClick={()=>handleClickScheduleExternal(project.documentation.finalDocumentation._id,project._id)}>
                                                            <ListItemIcon>
                                                                <AssignmentTurnedInOutlined />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit" noWrap>
                                                                Schedule External
                                                            </Typography>
                                                        </MenuItem>
                                                    }
                                                    {
                                                        project.documentation.finalDocumentation.status === 'External Scheduled' && type === 'external' &&
                                                        <MenuItem onClick={()=>handleClickEvaluate(project.documentation.finalDocumentation._id,project._id)}>
                                                            <ListItemIcon>
                                                                <AssignmentTurnedInOutlined />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit" noWrap>
                                                                Evaluate
                                                            </Typography>
                                                        </MenuItem>
                                                    }
                                                    <MenuItem onClick={()=>setAnchorEl(null)}>
                                                        <ListItemIcon>
                                                            <Close />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Cancel
                                                        </Typography>
                                                    </MenuItem>

                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    </Tooltip>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            }
            <Dialog
                open={dialog.evaluation}
                onClose={()=> setDialog({...dialog, evaluation:false})}
                fullWidth
                maxWidth='xs'
            >
                {loading.evaluation && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Evaluate</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=> setDialog({...dialog, evaluation:false})}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <Typography>Please Provide marks obtained</Typography>
                    <TextField
                        label='Marks Obtained'
                        margin='dense'
                        variant='outlined'
                        name='marks'
                        value={data.marks}
                        onChange={handleChangeMarksObtained}
                        error={error.show}
                        helperText={error.message}
                        placeholder={`0-${marks.internal}`}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setDialog({...dialog, evaluation:false})}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={handleConfirmEvaluation}>Confirm</Button>
                </DialogActions>
            </Dialog>

        {/*External Scheduling Dialog*/}
            <Dialog fullWidth maxWidth='sm' open={dialog.schedule} onClose={()=> setDialog({...dialog, schedule:false})}>
                {loading.schedule && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Schedule Internal</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=> setDialog({...dialog, schedule:false})}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <SchedulingDialogContent
                        venue={venue}
                        handleDateChange={handleDateChange}
                        selectedDate={selectedDate}
                        setVenue={setVenue}
                    />

                </DialogContent>
                <DialogActions>
                    <DialogActions>
                        <Button onClick={()=> setDialog({...dialog, schedule:false})}>Cancel</Button>
                        <Button variant='outlined' color='secondary' onClick={handleExternalSchedule}>Confirm</Button>
                    </DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RenderInternalsExternals;