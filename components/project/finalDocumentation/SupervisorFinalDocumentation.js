import React, { useEffect, useState} from 'react';


import {fetchFinalDocumentationsBySupervisorAPI} from "../../../utils/apiCalls/projects";
import {
    Container,
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
    Assignment,
    PictureAsPdfOutlined,
    MoreVertOutlined,
    ThumbDownAltOutlined,
    ThumbUpAltOutlined,
    SendOutlined, Close
} from "@material-ui/icons";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {makeStyles} from "@material-ui/styles";
import moment from "moment";
import {serverUrl} from "../../../utils/config";
import Button from "@material-ui/core/Button";
import {changeFinalDocumentationStatusAPI} from "../../../utils/apiCalls/users";


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
    const [filterDepartment,setFilterDepartment] = useState('All');
    const [loading,setLoading]=useState({
        main:true,
        dialog:false
    });
    const [documents,setDocuments]= useState([]);
    const [filteredDocs,setFilteredDocs]=useState([]);
    const [confirmDialog,setConfirmDialog] = useState(false);
    const [notApprovedDialog,setNotApprovedDialog] = useState(false);

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
                setDocuments(result);
                setFilteredDocs(result);
                console.log(result)
                setLoading({...loading,main:false})
            })
    }
    useEffect(()=>{
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
        }else {
            setConfirmDialog(true)
        }
    };
    const handleComment = event =>{
        setComment({error:false,text:event.target.value})
    }
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
                setLoading({main:true,dialog: false});
                setConfirmDialog(false);
                setNotApprovedDialog(false);
                fetchData();
            });
    }
    return (
        <div>
            {
                loading.main ? <LinearProgress/> :

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
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Title</TableCell>
                                            <TableCell align="left">Department</TableCell>
                                            <TableCell align="left">Students</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="left">UploadedAt</TableCell>
                                            <TableCell align="left">File</TableCell>
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
                                                })
                                                return(
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
                                                                <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${finalDoc.document.filename}`} target="_blank" >
                                                                    <PictureAsPdfOutlined />
                                                                </a>
                                                            </TableCell>
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
                                                                        finalDoc.status === 'Approved' && !moment(Date.now()).isBefore(doc.details.estimatedDeadline) &&
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
        </div>
    );
};


export default SupervisorFinalDocumentation;