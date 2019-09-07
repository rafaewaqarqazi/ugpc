import React, {useContext, useState} from 'react';
import {
    Button,
    Chip, Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton, InputAdornment,
    Menu, List, ListItem, ListItemAvatar, ListItemText, MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography, ListItemIcon, AppBar, Toolbar
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {isAuthenticated} from "../../../auth";
import Avatar from "@material-ui/core/Avatar";
import {serverUrl} from "../../../utils/config";
import {Assignment, Send, AttachFile, PictureAsPdfOutlined, ExitToAppOutlined} from "@material-ui/icons";
import VisionDocsContext from "../../../context/visionDocs/visionDocs-context";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import {getVisionDocsStatusChipColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {DropzoneArea} from "material-ui-dropzone";
import {getRandomColor} from "../../../src/material-styles/randomColors";
import CloseIcon from '@material-ui/icons/Close';
import ApprovalLetter from "../../approvalLetter/ApprovalLetter";
import {getChairmanName} from "../../../utils/apiCalls/users";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    detailsContent:{
        marginBottom:theme.spacing(2)
    },
    document: {
        cursor:'pointer',
        width:70,
        height:70,
        border:'1px solid lightgrey',
        borderRadius:2,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        "&:hover":{
            boxShadow:theme.shadows[2]
        },
        '& a':{
            textDecoration:'none',
            color:'#9E9E9E'
        },
        marginRight:theme.spacing(1)
    },
    documentsList:{
        display: 'flex',
        padding: theme.spacing(1)
    },

    commentList:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    majorModules:{
        marginRight:theme.spacing(0.5)
    },
    wrapText:{
        maxWidth:400,
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },
    avatar:{
        backgroundColor:getRandomColor()
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        color:theme.palette.background.paper
    },
}));
const StudentVisionDocDetailsDialog = ({currentDocument,open,handleClose,setCurrentDocument,project}) => {
    const classes = useStyles();
    const visionDocsContext = useContext(VisionDocsContext);
    const [comment,setComment] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDocUploadDialog,setOpenDocUploadDialog] = useState(false);
    const [openPPTUploadDialog,setOpenPPTUploadDialog] = useState(false);
    const [fileDialogLoading,setFileDialogLoading] = useState(false);
    const [file,setFile]=useState([]);
    const [fileError,setFileError] = useState(false);
    const [letterViewer,setLetterViewer] = useState(false);
    const [chairmanName,setChairmanName]= useState('');
    const handleClickAttachDocumentMenu = (event)=> {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseAttachDocumentMenu = ()=> {
        setAnchorEl(null);
    }
    const handleCommentChange = e =>{
        setComment(e.target.value)
    };
    const handleComment = ()=>{
        if (comment !== ''){
            const commentDetails = {
                text:comment,
                projectId:projectId,
                documentId:currentDocument._id,
                author:isAuthenticated().user._id
            };
            visionDocsContext.comment(commentDetails)
                .then(res =>{
                    const a = currentDocument.comments.push({
                        text:comment,
                        createdAt:Date.now(),
                        author:{
                            name:isAuthenticated().user.name,
                            role:isAuthenticated().user.role
                        }
                    })
                    setCurrentDocument({
                        ...currentDocument,
                        a
                    })
                })
        }

    };
    const handleDropZone = files=>{
        setFileError(false);
        setFile(files[0])
    };

    const handleOnCloseDocDialog = ()=>{
        setOpenDocUploadDialog(false);
    };
    const handleOnClosePPTDialog = ()=>{
        setOpenPPTUploadDialog(false)
    };
    const closeLetterViewer = ()=>{
        setLetterViewer(false)
    };
    const openLetterViewer = ()=>{
        getChairmanName()
            .then(result=>{
                console.log(result);
                if (result.name){
                    setChairmanName(result.name);
                }
                else {
                    setChairmanName('Not Available Yet')
                }
                setLetterViewer(true);
            })

    }
    const handleUploadFile = type=>{
        if (file.length === 0){
            setFileError(true)
        }
        else {
            setFileDialogLoading(true);
            let formData = new FormData();
            formData.set('file',file)
            formData.set('projectId',projectId);
            formData.set('documentId',currentDocument._id)


            visionDocsContext.submitAdditionFilesVisionDoc(formData,type)
                .then(res => {
                    // setUploadSuccess(true);
                    setOpenDocUploadDialog(false);
                    setOpenPPTUploadDialog(false);
                    setFileDialogLoading(false);
                })
                .catch(error => console.log(error))
        }

    };

    return (
        <>
        <Dialog
            fullWidth={true}
            maxWidth='md'
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title"
        >

            <DialogTitle id="dialog-title">{currentDocument.title}</DialogTitle>
            {open && <>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip style={getVisionDocsStatusChipColor(currentDocument.status)} label={currentDocument.status}  size="small"/>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Abstract
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.abstract}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Scope
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.scope}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Major Modules
                                </Typography>
                                {
                                    currentDocument.majorModules.map((module,index)=>
                                        <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                    )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Students
                                </Typography>
                                {
                                    project.students.map((student)=>
                                        <Container key={student._id}>
                                            <List>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar className={classes.avatar}>{student.name.charAt(0).toUpperCase()}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={student.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    display='inline'
                                                                    color="textPrimary"
                                                                >
                                                                    {student.department}
                                                                </Typography>
                                                                {` — ${student.student_details.regNo}`}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Container>
                                    )
                                }

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Documents
                                </Typography>
                                <div>
                                    <Container>
                                        <Typography noWrap>Vision Docs</Typography>
                                        <div className={classes.documentsList}>
                                            {
                                                currentDocument.documents.map(document =>{
                                                    if(document.type === 'application/pdf'){
                                                        return (
                                                            <div className={classes.document} key={document.filename} >
                                                                <a href={`${serverUrl}/../pdf/${document.filename}`} target="_blank" >
                                                                    <PictureAsPdfOutlined style={{width: 50, height: 50}} />
                                                                </a>
                                                            </div>
                                                        )}

                                                })
                                            }
                                        </div>

                                    </Container>

                                </div>
                                <div>
                                    <Container>
                                        <Typography noWrap>Presentation</Typography>
                                        <div className={classes.documentsList}>
                                            {
                                                currentDocument.documents.map(document =>{
                                                    if(document.type === 'application/vnd.ms-powerpoint' || document.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
                                                        return (
                                                            <div className={classes.document} key={document.filename}>
                                                                <a key={document.filename} href={`${serverUrl}/../presentation/${document.filename}`} target="_blank" >
                                                                    <Assignment style={{width: 50, height: 50}} />
                                                                </a>
                                                            </div>
                                                        )}

                                                })
                                            }
                                        </div>

                                    </Container>

                                </div>
                                {
                                    (currentDocument.status === 'Meeting Scheduled' || currentDocument.status === 'Approved with Changes') &&
                                    <IconButton
                                        aria-controls="attachment-menu"
                                        aria-haspopup="true"
                                        onClick={handleClickAttachDocumentMenu}
                                        style={{marginTop:5}}
                                    >
                                        <AttachFile/>
                                    </IconButton>
                                }


                                <Menu
                                    id="attachment-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseAttachDocumentMenu}
                                >
                                    {
                                        currentDocument.status === 'Approved with Changes' &&
                                        <MenuItem onClick={()=>setOpenDocUploadDialog(true)}>
                                            <ListItemIcon>
                                                <PictureAsPdfOutlined />
                                            </ListItemIcon>
                                            <Typography variant="inherit" noWrap>
                                                ReSubmit Vision Document
                                            </Typography>
                                        </MenuItem>
                                    }

                                    {
                                        currentDocument.status === 'Meeting Scheduled' &&
                                        <MenuItem onClick={()=>setOpenPPTUploadDialog(true)}>
                                            <ListItemIcon>
                                                <Assignment />
                                            </ListItemIcon>
                                            <Typography variant="inherit" noWrap>
                                                Presentation File
                                            </Typography>
                                        </MenuItem>
                                    }

                                </Menu>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Comments
                                </Typography>
                                {
                                    currentDocument.comments.length === 0 ?
                                        <Typography variant='h6' color='textSecondary' style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                                            No Comments Yet
                                        </Typography>
                                        :
                                        <Container>
                                            <List className={classes.commentList}>
                                                {
                                                    currentDocument.comments.map(comment=>
                                                        <ListItem alignItems="flex-start" key={comment._id} divider>
                                                            <ListItemAvatar>
                                                                <Avatar className={classes.avatar}>{comment.author.name.charAt(0).toUpperCase()}</Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={comment.author.name}
                                                                secondary={
                                                                    <React.Fragment>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="textSecondary"
                                                                        >
                                                                            {comment.author.role}
                                                                        </Typography>
                                                                        {` — ${comment.text}`}
                                                                    </React.Fragment>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ) }
                                            </List>
                                        </Container>

                                }
                            </div>
                            <div className={classes.detailsContent}>
                                <TextField
                                    label="Add Comment"
                                    margin="dense"
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    value={comment}
                                    onChange={handleCommentChange}
                                    rowsMax="4"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size='small' onClick={handleComment}>
                                                    <Send />
                                                </IconButton>

                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {
                        project.details && project.details.acceptanceLetter.name && (
                            <Button onClick={openLetterViewer} className={classes.buttonSuccess} variant='contained'>View Acceptance Letter</Button>
                        )
                    }
                    <Button onClick={handleClose} color="primary" variant='contained'>
                        Close
                    </Button>
                </DialogActions>
            </>
            }
        </Dialog>
            <Dialog
                open={openDocUploadDialog}
                onClose={handleOnCloseDocDialog}
                maxWidth='md'
                fullWidth
            >
                <DialogContent>
                    <DropzoneArea
                        onChange={handleDropZone}
                        acceptedFiles={['application/pdf']}
                        filesLimit={1}
                        dropzoneText='Drag and drop document file here or click'
                    />
                    {fileError && <Typography variant='caption' color='error'>Please Upload File</Typography> }
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleOnCloseDocDialog}>
                        Cancel
                    </Button>
                    <Button color='secondary' onClick={()=>handleUploadFile('pdf')}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openPPTUploadDialog}
                onClose={handleOnClosePPTDialog}
                maxWidth='md'
                fullWidth
            >
                <DialogContent>
                    <DropzoneArea
                        onChange={handleDropZone}
                        acceptedFiles={['application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation']}
                        filesLimit={1}
                        dropzoneText='Drag and drop Presentation file here or click'
                    />
                    {fileError && <Typography variant='caption' color='error'>Please Upload File</Typography> }
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleOnClosePPTDialog}>
                        Cancel
                    </Button>
                    <Button color='secondary' onClick={()=>handleUploadFile('presentation')}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={letterViewer} onClose={closeLetterViewer} fullScreen>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={closeLetterViewer} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title} noWrap>
                            Auto Generated Acceptance Letter
                        </Typography>
                        <Button color="inherit" onClick={closeLetterViewer}>
                            Download
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{height:500}}>
                    {
                        project.details &&(
                            <ApprovalLetter
                                title={currentDocument.title}
                                students={project.students}
                                supervisor={project.details.supervisor}
                                date={project.details.acceptanceLetter.issueDate}
                                chairmanName={chairmanName}
                            />)
                    }

                </DialogContent>
            </Dialog>
            </>
    );
};

export default StudentVisionDocDetailsDialog;