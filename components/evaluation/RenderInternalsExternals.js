import React, {useState} from 'react';
import {
    Dialog, DialogActions, DialogContent,
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
    Button, FormControl, InputLabel, Select, OutlinedInput, InputAdornment, DialogContentText
} from "@material-ui/core";
import moment from "moment";
import {AssignmentTurnedInOutlined, Close, MoreVertOutlined, PictureAsPdfOutlined, Search, Replay} from "@material-ui/icons";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import {serverUrl} from "../../utils/config";
import {evaluateInternalExternalAPI, scheduleExternalDateAPI} from "../../utils/apiCalls/projects";
import {changeFinalDocumentationStatusAPI} from "../../utils/apiCalls/users";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import SchedulingDialogContent from "../coordinator/presentations/SchedulingDialogContent";
import UserAvatarComponent from "../UserAvatarComponent";
import {useTableStyles} from "../../src/material-styles/tableStyles";
import DialogTitleComponent from "../DialogTitleComponent";
import ErrorSnackBar from "../snakbars/ErrorSnackBar";
import {useDialogStyles} from "../../src/material-styles/dialogStyles";

const RenderInternalsExternals = ({projects,marks,type,fetchData}) => {
    const tableClasses = useTableStyles();
    const classes = useListContainerStyles();
    const dialogClasses = useDialogStyles()
    const [filter,setFilter] = useState(projects);
    const emptyStyles = useListItemStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [comment,setComment] = useState({
        text:'',
        error:false
    });
    const [loading,setLoading]= useState({
        evaluation:false,
        schedule:false,
        reSubmit:false
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
        status:'',
        documentId:'',
        projectId:'',
        marks:0
    });
    const [error,setError] = useState({
        show:false,
        message:''
    });
    const [resError,setResError] = useState({
        show:false,
        message:''
    });
    const [dialog,setDialog] = useState({
        evaluation:false,
        schedule:false,
        reSubmit:false
    });
    const handleClickEvaluate = ()=>{
        setError({show:false,message:''});
        setDialog({
            ...dialog,
            evaluation:true
        })
    };
    const handleClickReSubmit = ()=>{
        setError({show:false,message:''});

        setDialog({
            ...dialog,
            reSubmit:true
        })
    };
    const handleClickScheduleExternal = ()=>{
        setError({show:false,message:''});
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
        if (data.marks === '' || data.marks < 0 || data.marks > (type === 'internal' ? marks.internal:marks.external)){
            setError({show:true,message:`Provide Marks in 0-${type === 'internal' ? marks.internal:marks.external} Limit`})
        }else {
            setLoading({
                ...loading,
                evaluation:true
            });
            evaluateInternalExternalAPI({projectId:data.projectId,marks:data.marks,type})
                .then(result =>{
                    if (result.error){
                        setResError({
                            show:true,
                            message:result.error
                        });
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
                                setResError({
                                    show:true,
                                    message:res.error
                                });
                                setLoading({
                                    ...loading,
                                    evaluation:false
                                });
                                setDialog({
                                    ...dialog,
                                    evaluation:false
                                })
                                return;
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
                    setResError({
                        show:true,
                        message:result.error
                    });
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
                            setResError({
                                show:true,
                                message:res.error
                            });
                            setLoading({
                                ...loading,
                                schedule:false
                            });
                            setDialog({
                                ...dialog,
                                schedule:false
                            });
                            return;
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
        const dataFilter = filtered;
        setFilter(e.target.value !==''? dataFilter.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : filtered)
    };
    const handleComment = event =>{
        setComment({error:false,text:event.target.value})
    };
    const handleResubmit = ()=>{
        if (comment.text === ''){
            setComment({...comment,error:true});
            return;
        }
        const sData = {
            projectId:data.projectId,
            documentId:data.documentId,
            status:'ReSubmit',
            comment:comment.text
        };
        changeFinalDocumentationStatusAPI(sData)
            .then(res => {
                if (res.error){
                    setResError({
                        show:true,
                        message:res.error
                    });
                    setLoading({
                        ...loading,
                        reSubmit:false
                    });
                    setDialog({
                        ...dialog,
                        reSubmit:false
                    });
                    return;
                }
                setLoading({
                    ...loading,
                    reSubmit:false
                });
                setDialog({
                    ...dialog,
                    reSubmit:false
                });
                setSuccess({
                    open:true,
                    message:'Success'
                });
                fetchData();
            })
    };
    const handleClickActionMenu = (status,documentId,projectId,event) =>{
        setData({
            ...data,
            status,documentId,projectId
        });
        setAnchorEl(event.currentTarget);
    };
    return (
        <div>
            <SuccessSnackBar message={success.message} open={success.open} handleClose={()=>setSuccess({open:false,message:''})}/>
            <ErrorSnackBar open={resError.show} message={resError.message} handleSnackBar={()=>setResError({show:false,message:''})}/>
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
                <div className={tableClasses.tableWrapper}>

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
                                <TableCell align="left">PlagiarismReport</TableCell>
                                <TableCell align="left">Marks</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                filter.length === 0  ?
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <div className={emptyStyles.emptyListContainer}>
                                                <div className={emptyStyles.emptyList}>
                                                    No Projects Found
                                                </div>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                    :
                                filter.map((project,index) => (
                                    <TableRow key={index} className={tableClasses.tableRow} >
                                        <TableCell align="left" >{project.documentation.visionDocument.title}</TableCell>
                                        <TableCell align="left" >{project.department}</TableCell>
                                        <TableCell style={{display:'flex'}}>
                                            {
                                                project.students.map((student,index) =>
                                                    <UserAvatarComponent user={student} key={index}/>
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
                                        <TableCell align="center">
                                            <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${project.documentation.finalDocumentation.document.filename}`} target="_blank" >
                                                    <PictureAsPdfOutlined />
                                                </a>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            {
                                                project.documentation.finalDocumentation.plagiarismReport ?
                                                    <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                        <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${project.documentation.finalDocumentation.plagiarismReport.filename}`} target="_blank" >
                                                            <PictureAsPdfOutlined />
                                                        </a>
                                                    </Tooltip>
                                                    :
                                                    'Not Uploaded'
                                            }

                                        </TableCell>
                                        <TableCell align="left">{
                                            type === 'internal' ?
                                            project.details.marks.internal ? project.details.marks.internal  : 'Not Assigned'
                                                :
                                            project.details.marks.external ? project.details.marks.external  : 'Not Assigned'
                                        }</TableCell>
                                        <TableCell align="left">
                                            <Tooltip title='Click for Actions' placement='top'>
                                                <IconButton size='small' onClick={(event)=>handleClickActionMenu(project.documentation.finalDocumentation.status,project.documentation.finalDocumentation._id,project._id,event)}>
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
                                                    data.status !== 'ReSubmit' &&
                                                    <MenuItem onClick={handleClickReSubmit}>
                                                        <ListItemIcon>
                                                            <Replay />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Re Submit
                                                        </Typography>
                                                    </MenuItem>
                                                }


                                                {
                                                    (data.status === 'Internal Scheduled' && type === 'internal') &&
                                                    <MenuItem onClick={handleClickEvaluate}>
                                                        <ListItemIcon>
                                                            <AssignmentTurnedInOutlined />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Evaluate
                                                        </Typography>
                                                    </MenuItem>
                                                }
                                                {
                                                    data.status === 'External Assigned' && type === 'external' &&
                                                    <MenuItem onClick={handleClickScheduleExternal}>
                                                        <ListItemIcon>
                                                            <AssignmentTurnedInOutlined />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Schedule External
                                                        </Typography>
                                                    </MenuItem>
                                                }
                                                {
                                                    (data.status === 'External Scheduled' && type === 'external') &&
                                                    <MenuItem onClick={handleClickEvaluate}>
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
                classes={{paper: dialogClasses.root}}
            >
                {loading.evaluation && <LinearProgress/>}
                <DialogTitleComponent title='Evaluate' handleClose={()=> setDialog({...dialog, evaluation:false})}/>
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
                        placeholder={`0-${type === 'internal' ? marks.internal : marks.external}`}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setDialog({...dialog, evaluation:false})}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={handleConfirmEvaluation}>Confirm</Button>
                </DialogActions>
            </Dialog>

        {/*External Scheduling Dialog*/}
            <Dialog fullWidth maxWidth='sm' open={dialog.schedule} onClose={()=> setDialog({...dialog, schedule:false})} classes={{paper: dialogClasses.root}}>
            {loading.schedule && <LinearProgress/>}
            <DialogTitleComponent title='Schdule External' handleClose={()=> setDialog({...dialog, schedule:false})}/>
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
        {/*    ReSubmit Dialog*/}
        <Dialog fullWidth maxWidth='sm' open={dialog.reSubmit} onClose={()=> setDialog({...dialog, reSubmit:false})} classes={{paper: dialogClasses.root}}>
            {loading.confirm && <LinearProgress/>}
            <DialogTitleComponent title='Confirm' handleClose={()=> setDialog({...dialog, reSubmit:false})}/>
            <DialogContent dividers>
                <DialogContentText>Write a reason in Comment</DialogContentText>
                <TextField
                    fullWidth
                    required
                    autoFocus
                    variant='outlined'
                    value={comment.text}
                    onChange={handleComment}
                    margin='dense'
                    error={comment.error}
                    helperText={comment.error && 'Please write a comment'}
                    label='Comment'
                />
            </DialogContent>
            <DialogActions>
                <DialogActions>
                    <Button onClick={()=> setDialog({...dialog, reSubmit:false})}>Cancel</Button>
                    <Button variant='outlined' color='secondary' onClick={handleResubmit}>Confirm</Button>
                </DialogActions>
            </DialogActions>
        </Dialog>
        </div>
    );
};

export default RenderInternalsExternals;