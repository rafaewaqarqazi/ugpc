import React, {Fragment, useContext, useState} from 'react';
import {
    Button,
    Chip, CircularProgress, Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton, InputAdornment,
    InputLabel, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography,
    AppBar,
    Toolbar, Collapse, Divider
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {isAuthenticated} from "../../../../auth";
import Avatar from "@material-ui/core/Avatar";
import {serverUrl} from "../../../../utils/config";
import {Assignment, ExpandLess, ExpandMore, PictureAsPdfOutlined, Send} from "@material-ui/icons";
import VisionDocsContext from "../../../../context/visionDocs/visionDocs-context";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import {getVisionDocsStatusChipColor} from "../../../../src/material-styles/visionDocsListBorderColor";
import {assignSupervisorAuto, generateAcceptanceLetter} from "../../../../utils/apiCalls/projects";
import SuccessSnackBar from "../../../snakbars/SuccessSnackBar";
import { PDFDownloadLink } from '@react-pdf/renderer'
import ApprovalLetter from "../../../approvalLetter/ApprovalLetter";
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import {getChairmanName} from "../../../../utils/apiCalls/users";
import {getRandomColor} from "../../../../src/material-styles/randomColors";

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
    greenAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
        cursor:'pointer',
        width:80,
        height:80
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

        whiteSpace: 'normal',
        overflow:'hidden',
        textOverflow: 'ellipsis'
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        color:theme.palette.background.paper
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    avatar:{
        backgroundColor:getRandomColor()
    }
}));
const VisionDocDetailsDialog = ({currentDocument,open,handleClose,setCurrentDocument,inputLabel,labelWidth}) => {
    const classes = useStyles();
    const visionDocsContext = useContext(VisionDocsContext);
    const [changeStatus,setChangeStatus] = useState('No Change');
    const [commentText,setCommentText] = useState('');
    const [confirmDialog,setConfirmDialog] = useState(false);
    const [confirmDialogLoading,setConfirmDialogLoading] = useState(false);
    const [successSnackbar,setSuccessSnackbar] = useState(false);
    const [letterViewer,setLetterViewer] = useState(false);
    const [generateLetterLoading,setGenerateLetterLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [chairmanName,setChairmanName]= useState('');
    const [showComments,setShowComments] = useState(false);
    const [marks,setMarks] = useState('');
    const [saveButton,setSaveButton]= useState(true);
    const handleMarksChange = event =>{
        if (event.target.value === ''){
            setSaveButton(true)
        }else{
            setSaveButton(false)
        }

        setMarks(event.target.value);
    }
    const handleShowComments = e =>{
        setShowComments(!showComments);
    }
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
    const handleChangeStatus = e =>{
        setChangeStatus(e.target.value)
    };
    const handleCommentChange = e =>{
        setCommentText(e.target.value)
    };
    const handleCloseConfirmDialog = ()=>{
        setConfirmDialog(false);
    };
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });
    const handleMarksSave = ()=>{

        visionDocsContext.addMarks(marks,currentDocument._id)
            .then(res => {
                console.log(res)
                setCurrentDocument({
                    ...currentDocument,
                    details: {
                        ...currentDocument.details,
                        marks:{
                            ...currentDocument.details.marks,
                            visionDocument: marks
                        }
                    }
                })
            })
    }

    const handleGenerateLetterButtonClick =()=> {
        setGenerateLetterLoading(true);
        generateAcceptanceLetter(currentDocument._id,currentDocument.students[0].student_details.regNo)
            .then(result =>{
                console.log(result);
                setCurrentDocument({
                    ...currentDocument,
                    details:{
                        ...currentDocument.details,
                        acceptanceLetter: {
                            name:`${currentDocument.students[0].student_details.regNo}.pdf`,
                            issueDate: result.issueDate
                        }
                    }
                })
                setSuccess(true);
                setGenerateLetterLoading(false);
            })

    }
    const handleComment = ()=>{
        if (commentText !== ''){
            const commentDetails = {
                text:commentText,
                projectId:currentDocument._id,
                documentId:currentDocument.documentation.visionDocument._id,
                author:isAuthenticated().user._id
            };
            console.log(commentDetails);
            visionDocsContext.comment(commentDetails)
                .then(res =>{
                    const a = currentDocument.documentation.visionDocument.comments.push({
                        text:commentText,
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
    const handleConfirm = ()=>{
        setConfirmDialogLoading(true);
        const statusDetails = {
            status:changeStatus,
            projectId:currentDocument._id,
            documentId:currentDocument.documentation.visionDocument._id,
        }
        visionDocsContext.changeStatus(statusDetails)
            .then(res =>{
                assignSupervisorAuto(currentDocument._id,currentDocument.documentation.visionDocument.title)
                    .then(result => {
                        if (result.error){
                            console.log(result.error)
                            return;
                        }

                        setCurrentDocument({...currentDocument,documentation:{
                                ...currentDocument.documentation,
                                visionDocument: {
                                    ...currentDocument.documentation.visionDocument,
                                    status:changeStatus
                                }
                            }});
                        setChangeStatus('No Change');
                        setSuccessSnackbar(true);
                        setConfirmDialog(false);
                        setConfirmDialogLoading(false);
                    })


            })
    };
    const closeSnackbar = ()=>{
        setSuccessSnackbar(false);
    };

    const closeLetterViewer = ()=>{
        setLetterViewer(false)
    }
    return (
        <div>
            <SuccessSnackBar open={successSnackbar} message={'Success'} handleClose={closeSnackbar}/>
            <Dialog
                fullWidth
                maxWidth='lg'
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
            >

                <DialogTitle id="dialog-title">{currentDocument.documentation.visionDocument.title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {/*<PDFDownloadLink document={<ApprovalLetter />} fileName="somename.pdf" style={{textDecoration: 'none'}}>*/}
                            {/*    {({ blob, url, loading, error }) => (loading ? <CircularProgress/> : <Button>Download</Button>)}*/}
                            {/*</PDFDownloadLink>*/}


                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip style={getVisionDocsStatusChipColor(currentDocument.documentation.visionDocument.status)} label={currentDocument.documentation.visionDocument.status}  size="small"/>
                            </div>
                            {
                                isAuthenticated().user.role === 'UGPC_Member' &&
                                <div className={classes.detailsContent}>
                                    <Typography color='textSecondary'>
                                        Change Status
                                    </Typography>
                                    <FormControl variant="outlined" margin='dense' className={classes.formControl}>
                                        <InputLabel ref={inputLabel} htmlFor="changeStatus">
                                            Status
                                        </InputLabel>
                                        <Select
                                            value={changeStatus}
                                            onChange={handleChangeStatus}
                                            input={<OutlinedInput labelWidth={labelWidth} name="changeStatus" id="changeStatus" />}
                                        >
                                            <MenuItem value='No Change'>No Change</MenuItem>
                                            {
                                                isAuthenticated().user.ugpc_details.position === 'Coordinator' &&
                                                currentDocument.documentation.visionDocument.status === 'Waiting for Initial Approval' &&
                                                <MenuItem value='Approved for Meeting'>Approve for Meeting</MenuItem>
                                            }
                                            {
                                                currentDocument.documentation.visionDocument.status === 'Meeting Scheduled' &&
                                                <MenuItem value='Approved With Changes'>Approve With Changes</MenuItem>
                                            }
                                            {
                                                currentDocument.documentation.visionDocument.status === 'Meeting Scheduled' &&
                                                <MenuItem value='Approved'>Approve</MenuItem>
                                            }
                                            {
                                                currentDocument.documentation.visionDocument.status !== 'Approved' && currentDocument.documentation.visionDocument.status !== 'Approved With Changes' &&
                                                <MenuItem value='Rejected'>Reject</MenuItem>
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Abstract
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.documentation.visionDocument.abstract}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Scope
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.documentation.visionDocument.scope}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Major Modules
                                </Typography>
                                {
                                    currentDocument.documentation.visionDocument.majorModules.map((module,index)=>
                                        <Chip  key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                    )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Students
                                </Typography>

                                <Container >
                                    <List >
                                        {
                                            currentDocument.students.map((student,index)=>(
                                                <ListItem alignItems="flex-start" key={index}>
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
                                            ))
                                        }
                                    </List>
                                </Container>

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
                                                currentDocument.documentation.visionDocument.documents.map((document) =>{
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
                                                currentDocument.documentation.visionDocument.documents.map(document =>{
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

                            </div>
                            {
                                (currentDocument.documentation.visionDocument.status === 'Approved' || currentDocument.documentation.visionDocument.status === 'Approved With Changes') &&
                                <div className={classes.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        Marks
                                    </Typography>
                                    {
                                        currentDocument.details.marks ?
                                            <Container>
                                                <Typography variant='h6' color='textSecondary'>{`(${currentDocument.details.marks.visionDocument}/10)`}</Typography>
                                            </Container>
                                             :
                                            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                                <TextField
                                                    label="Add Marks"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={marks}
                                                    onChange={handleMarksChange}
                                                    placeholder='0-10'
                                                />
                                                <Button onClick={handleMarksSave} disabled={saveButton} style={{marginLeft:2}} variant='outlined' color='primary'>Save</Button>
                                            </div>
                                    }

                                </div>
                            }
                            <div className={classes.detailsContent}>
                                <List>
                                    <ListItem button onClick={handleShowComments}>
                                        <ListItemText primary="Show Comments" />
                                        {showComments ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={showComments} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding className={classes.commentList}>
                                        {
                                            currentDocument.documentation.visionDocument.comments.length === 0 ?
                                                <ListItem>
                                                    <Typography variant='h5' color='textSecondary'>No Comments Yet</Typography>
                                                </ListItem>
                                                :
                                                <Container>
                                                    {
                                                        currentDocument.documentation.visionDocument.comments.map((comment)=>(
                                                            <Fragment key={comment._id}>
                                                                <ListItem alignItems="flex-start" key={comment._id}>
                                                                    <ListItemAvatar>
                                                                        <Avatar className={classes.avatar}>{comment.author.name.charAt(0).toUpperCase()}</Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={
                                                                            <React.Fragment>
                                                                                <Typography
                                                                                    component="span"
                                                                                    variant="button"
                                                                                    display='inline'
                                                                                    color="textPrimary"
                                                                                >
                                                                                    {comment.author.name}
                                                                                </Typography>
                                                                                <div >
                                                                                    <Typography variant='caption' color='textSecondary'>
                                                                                        {comment.author.role}
                                                                                    </Typography>

                                                                                </div>

                                                                            </React.Fragment>
                                                                        }
                                                                        secondary={
                                                                            <Typography
                                                                                component="span"
                                                                                variant="body2"
                                                                                display='inline'
                                                                                color="textPrimary"
                                                                            >
                                                                                {comment.text}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider variant="inset" component="li" />
                                                            </Fragment>
                                                        ))
                                                    }
                                                </Container>
                                        }
                                        </List>
                                    </Collapse>
                                </List>
                            </div>
                            <div className={classes.detailsContent}>
                                <TextField
                                    label="Add Comment"
                                    margin="dense"
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    value={commentText}
                                    onChange={handleCommentChange}
                                    rowsMax="4"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size='small' >
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
                        (currentDocument.documentation.visionDocument.status === 'Approved' || currentDocument.documentation.visionDocument.status === 'Approved With Changes') &&(
                            currentDocument.details && !currentDocument.details.acceptanceLetter.name?
                                <div className={classes.wrapper}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={buttonClassname}
                                        disabled={generateLetterLoading}
                                        onClick={handleGenerateLetterButtonClick}
                                    >
                                        Generate Acceptance Letter
                                    </Button>
                                    {generateLetterLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>
                                :

                                <Button onClick={openLetterViewer} className={classes.buttonSuccess} variant='contained'>View Acceptance Letter</Button>
                        )


                    }

                    {
                        changeStatus !== 'No Change' &&
                        <Button onClick={()=>setConfirmDialog(true)} variant='contained' className={classes.buttonSuccess}>
                            Save
                        </Button>
                    }
                    <Button onClick={handleClose} color="primary" variant='contained'>
                        Close
                    </Button>
                </DialogActions>
            }
            </Dialog>
            <Dialog
                fullWidth
                maxWidth='xs'
                open={confirmDialog}
                onClose={handleCloseConfirmDialog}
            >
                {confirmDialogLoading && <LinearProgress color='secondary'/>}
                <DialogTitle>Confirm Changes?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" variant='contained'>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant='contained' color='secondary'>
                        Confirm
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
                        currentDocument.details &&(
                        <ApprovalLetter
                            title={currentDocument.documentation.visionDocument.title}
                            students={currentDocument.students}
                            supervisor={currentDocument.details.supervisor}
                            date={currentDocument.details.acceptanceLetter.issueDate}
                            chairmanName={chairmanName}
                        />)
                    }

                </DialogContent>
            </Dialog>
        </div>

    );
};

export default VisionDocDetailsDialog;