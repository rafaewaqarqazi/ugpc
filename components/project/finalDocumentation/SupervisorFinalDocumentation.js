import React, { useEffect, useState} from 'react';


import {
    fetchFinalDocumentationsBySupervisorAPI,
    fetchMarksDistributionAPI,
    uploadPlagiarismReportAPI
} from "../../../utils/apiCalls/projects";
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
    Dialog,  Zoom, DialogContent, DialogContentText, DialogActions
} from "@material-ui/core";
import {
    PictureAsPdfOutlined,
    MoreVertOutlined,
    ThumbDownAltOutlined,
    ThumbUpAltOutlined,
    SendOutlined, Close,
    PublishOutlined
} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import moment from "moment";
import {serverUrl} from "../../../utils/config";
import Button from "@material-ui/core/Button";
import {addSupervisorMarksAPI, changeFinalDocumentationStatusAPI} from "../../../utils/apiCalls/users";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import CircularLoading from "../../loading/CircularLoading";
import DialogTitleComponent from "../../DialogTitleComponent";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {DropzoneArea} from "material-ui-dropzone";


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
    const [uploadDialog,setUploadDialog] = useState({
        confirm:false,
        open:false
    });
    const [currentDoc,setCurrentDoc] = useState({})
    const [file,setFile]=useState([]);
    const [fileError,setFileError] = useState(false);
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

    const handleDropZone = files=>{
        setFileError(false);
        setFile(files[0])
    };
    const fetchData =()=>{
        fetchFinalDocumentationsBySupervisorAPI()
            .then(result =>{
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
    const handleClickUploadPlagiarismReport = (projectId,documentId) =>{
        setStatus({
            ...status,projectId,documentId
        });
        setUploadDialog({
            ...uploadDialog,
            open:true
        });
    };
    const handleUploadPlagiarismReport = ()=>{
        if (file.length === 0){
            setFileError(true)
        }
        else {
            setLoading(true);
            let formData = new FormData();
            formData.set('file',file);
            formData.set('projectId',status.projectId);
            formData.set('documentId',status.documentId);

            uploadPlagiarismReportAPI(formData)
                .then(res => {
                    setSuccess(true);
                    setLoading({main:true,dialog: false});
                    setTimeout(()=>{
                        setUploadDialog({
                            confirm:false,
                            open:false
                        });
                        fetchData();
                    },3000);
                })
                .catch(error => console.error(error))
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
        if (marks.marks === '' ||  marks.marks < 0 || marks.marks > marksDistribution){
            setMarks({...marks,error:true});
            return;
        }
        addSupervisorMarksAPI({projectId:status.projectId,marks:marks.marks})
            .then(result =>{
                handleConfirm();
            })
            .catch(err => console.error(err.message))

    };
    const openMenu = (status,docId,projectId,event) => {
        setCurrentDoc({
            status,docId,projectId
        });
        setAnchorEl(event.currentTarget)
    }
    const ActionsMenu = () => (
        <div>
            <MenuItem onClick={()=>handleClickUploadPlagiarismReport(currentDoc.projectId,currentDoc.docId)}>
                <ListItemIcon>
                    <PublishOutlined />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Plagiarism Report
                </Typography>
            </MenuItem>
            {
                currentDoc.status === 'Waiting for Approval' &&
                <div>
                    <MenuItem onClick={()=>handleClickChangeStatusMenu('Approved',currentDoc.projectId,currentDoc.docId)}>
                        <ListItemIcon>
                            <ThumbUpAltOutlined />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Approve
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={()=>handleClickChangeStatusMenu('NotApproved',currentDoc.projectId,currentDoc.docId)}>
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
                currentDoc.status === 'Approved' &&
                <MenuItem onClick={()=>handleClickChangeStatusMenu('Available for Internal',currentDoc.projectId,currentDoc.docId)}>
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
        </div>
    );
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
                                    <TableCell align="left">PlagiarismReport</TableCell>
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
                                                    <TableCell align="center">
                                                        <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                            <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${finalDoc.document.filename}`} target="_blank" >
                                                                <PictureAsPdfOutlined />
                                                            </a>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell >{doc.details.marks && doc.details.marks.supervisor ? doc.details.marks.supervisor : 'Not Provided'}</TableCell>
                                                    <TableCell align="center">
                                                        {
                                                            finalDoc.plagiarismReport ?
                                                                <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                                    <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${finalDoc.plagiarismReport.filename}`} target="_blank" >
                                                                        <PictureAsPdfOutlined />
                                                                    </a>
                                                                </Tooltip>
                                                                :
                                                                'Not Uploaded'
                                                        }

                                                    </TableCell>
                                                    <TableCell >
                                                        <Tooltip title='Click for Actions' placement='top'>
                                                            <IconButton size='small' onClick={(event)=>openMenu(finalDoc.status,finalDoc._id,doc._id,event)}>
                                                                <MoreVertOutlined/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            currentDoc &&
                                                            <Menu
                                                                id="menu"
                                                                anchorEl={anchorEl}
                                                                keepMounted
                                                                open={Boolean(anchorEl)}
                                                                onClose={()=>setAnchorEl(null)}
                                                            >
                                                                <ActionsMenu/>
                                                            </Menu>
                                                        }

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
                <DialogTitleComponent title='Confirm' handleClose={()=>setConfirmDialog(false)}/>
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
                <DialogTitleComponent title='Confirm' handleClose={()=>setNotApprovedDialog(false)}/>
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
            <Dialog fullWidth maxWidth='xs' open={uploadDialog.open} onClose={()=>setUploadDialog({...uploadDialog,open:false})}>
                {loading.dialog && <LinearProgress/>}
                <SuccessSnackBar open={success} message={'Success'} handleClose={()=>setSuccess(false)}/>
                <DialogTitleComponent title={'Upload Plagiarism Report'} handleClose={()=>setUploadDialog({...uploadDialog,open:false})}/>
                <DialogContent>
                    <DropzoneArea
                        onChange={handleDropZone}
                        acceptedFiles={['application/pdf']}
                        filesLimit={1}
                        maxFileSize={5000000}
                        dropzoneText='Drag and drop document file here or click'
                    />
                    {fileError && <Typography variant='caption' color='error'>Please Add a File</Typography> }
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={()=>setUploadDialog({...uploadDialog,open:false})}>
                        Cancel
                    </Button>
                    <Button color='secondary' onClick={handleUploadPlagiarismReport}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default SupervisorFinalDocumentation;