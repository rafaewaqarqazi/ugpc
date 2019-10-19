import React, { useEffect, useState} from 'react';


import {fetchFinalDocumentationsBySupervisorAPI, fetchMarksDistributionAPI} from "../../../utils/apiCalls/projects";
import {
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    IconButton,
    Menu,
    ListItemIcon,
    MenuItem,
    InputLabel,
    Select,
    OutlinedInput,
    FormControl,
    TextField,
    Dialog, DialogTitle, Zoom, DialogContent, DialogContentText, DialogActions
} from "@material-ui/core";
import {
    PictureAsPdfOutlined,
    MoreVertOutlined,
    ThumbDownAltOutlined,
    ThumbUpAltOutlined,
    SendOutlined, Close
} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import moment from "moment";
import {serverUrl} from "../../../utils/config";
import Button from "@material-ui/core/Button";
import {addSupervisorMarksAPI, changeFinalDocumentationStatusAPI} from "../../../utils/apiCalls/users";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import CircularLoading from "../../loading/CircularLoading";
import DialogTitleComponent from "../../DialogTitleComponent";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";


const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(5),
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflowX:'auto'
    },
    tableRow:{
        "&:hover":{
            boxShadow:theme.shadows[6]
        }
    },
}));
const SupervisorFinalDocumentation = () => {
    const emptyStyles = useListItemStyles();
    const [filterDepartment,setFilterDepartment] = useState('All');
    const [loading,setLoading]=useState({
        main:true,
        dialog:false
    });
    const [documents,setDocuments]= useState([]);
    const [filteredDocs,setFilteredDocs]=useState([]);
    const [confirmDialog,setConfirmDialog] = useState(false);
    const [notApprovedDialog,setNotApprovedDialog] = useState(false);
    const [marksDialog,setMarksDialog] = useState(false);
    const [success,setSuccess] = useState(false);
    const [marks,setMarks] = useState({
        marks:'',
        error:false
    });
    const [marksDistribution,setMarksDistribution] = useState(10);

    const [status,setStatus] = useState({
        status:'',
        projectId:'',
        documentId:''
    });
    const [comment,setComment] = useState({
        text:'',
        error:false
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const fetchData =()=>{
        fetchFinalDocumentationsBySupervisorAPI()
            .then(result =>{
                console.log(result)
                setDocuments(result);
                setFilteredDocs(result);
                setLoading({...loading,main:false})
            })
    };
    useEffect(()=>{
        fetchMarksDistributionAPI()
            .then(result =>{
                setMarksDistribution(result.supervisor)
            })
            .catch(error => console.error(error.message));

        fetchData();
    },[]);
    const handleDepChange = event =>{
        setFilterDepartment(event.target.value);
        const data = documents;
        if (event.target.value === 'All'){
            setFilteredDocs(documents)
        }else {
            setFilteredDocs(data.filter(d => d.department === event.target.value))
        }

    };
    const handleClickChangeStatusMenu = (status,projectId,documentId) => {
        setStatus({
            status,projectId,documentId
        });
        setAnchorEl(null);
        if (status === 'NotApproved'){
            setNotApprovedDialog(true);
        }else if (status === 'Available for Internal'){
            setMarksDialog(true);
        }
        else {
            setConfirmDialog(true)
        }
    };
    const handleComment = event =>{
        setComment({error:false,text:event.target.value})
    };
    const handleConfirm = ()=>{

        if(status.status === 'NotApproved' && comment.text === ''){
            setComment({...comment,error:true});
            return;
        }
        setLoading({...loading,dialog: true});
        const data = {
            ...status,
            comment:comment.text !== ''? comment.text : undefined
        };
        changeFinalDocumentationStatusAPI(data)
            .then(result => {
                setSuccess(true);
                setLoading({main:true,dialog: false});
                setTimeout(()=>{
                    setConfirmDialog(false);
                    setNotApprovedDialog(false);
                    setMarksDialog(false);
                    fetchData();
                },3000);
            });
    };
    const handleAddMarks = ()=>{
        if (marks.marks < 0 || marks.marks > marksDistribution){
            setMarks({...marks,error:true});
            return;
        }
        addSupervisorMarksAPI({projectId:status.projectId,marks:marks.marks})
            .then(result =>{
                handleConfirm();
            })
            .catch(err => console.error(err.message))

    };
    return (
        <div>

            {
                loading.main ? <CircularLoading/> :

                        <div >
                            <div>
                                <FormControl variant="outlined" margin='dense' style={{minWidth:160}}>
                                    <InputLabel htmlFor="depSwitch">
                                        Department
                                    </InputLabel>
                                    <Select
                                        value={filterDepartment}
                                        onChange={handleDepChange}
                                        input={<OutlinedInput  labelWidth={88} fullWidth name="depSwitch" id="depSwitch" required/>}
                                    >
                                        <MenuItem value='All' style={{fontSize:14}}>All</MenuItem>
                                        <MenuItem value='BSSE' style={{fontSize:14}}>BSSE</MenuItem>
                                        <MenuItem value='BSCS' style={{fontSize:14}}>BSCS</MenuItem>
                                        <MenuItem value='BSIT' style={{fontSize:14}}>BSIT</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className={classes.tableWrapper}>
                                <Table  size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Title</TableCell>
                                            <TableCell align="left">Department</TableCell>
                                            <TableCell align="left">Students</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="left">UploadedAt</TableCell>
                                            <TableCell align="left">File</TableCell>
                                            <TableCell align="left">Marks</TableCell>
                                            <TableCell align="left">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {
                                            filteredDocs.map((doc,index) => {
                                                const title = doc.documentation.visionDocument.map(vDoc => {
                                                    if (vDoc.status === 'Approved' || vDoc.status === 'Approved With Changes'){
                                                        return vDoc.title
                                                    }
                                                });
                                                return(
                                                    doc.documentation.finalDocumentation.length === 0?
                                                    <TableRow key={index}>
                                                        <TableCell align="left" >{title}</TableCell>
                                                        <TableCell align="left" >{doc.department}</TableCell>
                                                        <Tooltip title={doc.students[0].student_details.regNo} placement='top'>
                                                            <TableCell align="left" >{doc.students[0].name}</TableCell>
                                                        </Tooltip>
                                                        <TableCell colSpan={4}>
                                                            <div className={emptyStyles.emptyListContainer}>
                                                                <div className={emptyStyles.emptyList}>
                                                                    No Documents Found
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>:
                                                    doc.documentation.finalDocumentation.map(finalDoc => (
                                                        <TableRow  key={index} className={classes.tableRow} >
                                                            <TableCell align="left" >{title}</TableCell>
                                                            <TableCell align="left" >{doc.department}</TableCell>
                                                            <Tooltip title={doc.students[0].student_details.regNo} placement='top'>
                                                                <TableCell align="left" >{doc.students[0].name}</TableCell>
                                                            </Tooltip>
                                                            <TableCell >{finalDoc.status}</TableCell>
                                                            <TableCell align="left">{moment(finalDoc.uploadedAt).format('MMM DD, YYYY')}</TableCell>
                                                            <TableCell >
                                                                <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                                    <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${finalDoc.document.filename}`} target="_blank" >
                                                                        <PictureAsPdfOutlined />
                                                                    </a>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell >{doc.details.marks && doc.details.marks.supervisor ? doc.details.marks.supervisor : 'Not Provided'}</TableCell>
                                                            <TableCell >
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
                                                                        finalDoc.status === 'Waiting for Approval' &&
                                                                        <div>
                                                                            <MenuItem onClick={()=>handleClickChangeStatusMenu('Approved',doc._id,finalDoc._id)}>
                                                                                <ListItemIcon>
                                                                                    <ThumbUpAltOutlined />
                                                                                </ListItemIcon>
                                                                                <Typography variant="inherit" noWrap>
                                                                                    Approve
                                                                                </Typography>
                                                                            </MenuItem>
                                                                            <MenuItem onClick={()=>handleClickChangeStatusMenu('NotApproved',doc._id,finalDoc._id)}>
                                                                                <ListItemIcon>
                                                                                    <ThumbDownAltOutlined />
                                                                                </ListItemIcon>
                                                                                <Typography variant="inherit" noWrap>
                                                                                    Disapprove
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        finalDoc.status === 'Approved' &&
                                                                        <MenuItem onClick={()=>handleClickChangeStatusMenu('Available for Internal',doc._id,finalDoc._id)}>
                                                                            <ListItemIcon>
                                                                                <SendOutlined />
                                                                            </ListItemIcon>
                                                                            <Typography variant="inherit" noWrap>
                                                                                Send for Internal
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
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
            }
            <Dialog fullWidth maxWidth='xs' open={confirmDialog} onClose={()=>setConfirmDialog(false)} >
                {loading.dialog && <LinearProgress/>}
                <SuccessSnackBar open={success} message={'Success'} handleClose={()=>setSuccess(false)}/>
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Confirm</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=>setConfirmDialog(false)}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>Are You sure?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={()=>setConfirmDialog(false)}>Cancel</Button>
                    <Button variant='outlined' color='secondary' onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth maxWidth='xs' open={notApprovedDialog} onClose={()=>setNotApprovedDialog(false)} >
                {loading.dialog && <LinearProgress/>}
                <SuccessSnackBar open={success} message={'Success'} handleClose={()=>setSuccess(false)}/>
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Confirm</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=>setNotApprovedDialog(false)}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
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
                    <Button variant='contained' onClick={()=>setNotApprovedDialog(false)}>Cancel</Button>
                    <Button variant='outlined' color='secondary' onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={marksDialog}
                onClose={()=> setMarksDialog(false)}
                fullWidth
                maxWidth='xs'
            >
                {loading.dialog && <LinearProgress/>}
                <SuccessSnackBar open={success} message={'Success'} handleClose={()=>setSuccess(false)}/>
                <DialogTitleComponent title={'Add Marks'} handleClose={()=>setMarksDialog(false)}/>
                <DialogContent>
                    <Typography variant='caption' component='span'>Note: </Typography>
                    <Typography variant='body2' component='span'> You cannot change marks after adding!</Typography>
                    <Typography variant='subtitle1' component='div'>Please Provide marks obtained</Typography>
                    <TextField
                        label='Marks Obtained'
                        margin='dense'
                        variant='outlined'
                        name='marks'
                        value={marks.marks}
                        onChange={event => setMarks({...marks,marks:event.target.value})}
                        error={marks.error}
                        helperText={marks.error && `Provide Marks between 0-${marksDistribution}`}
                        placeholder={`0-${marksDistribution}`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setMarksDialog(false)}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={handleAddMarks}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default SupervisorFinalDocumentation;