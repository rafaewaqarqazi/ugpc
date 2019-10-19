import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Chip, CircularProgress, Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton, InputAdornment,
    InputLabel, LinearProgress, MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography,
    AppBar,
    Toolbar, DialogContentText
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {isAuthenticated} from "../../../../auth";

import { Send} from "@material-ui/icons";
import VisionDocsContext from "../../../../context/visionDocs/visionDocs-context";

import {getVisionDocsStatusChipColor} from "../../../../src/material-styles/visionDocsListBorderColor";
import SuccessSnackBar from "../../../snakbars/SuccessSnackBar";
import ApprovalLetter from "../../../approvalLetter/ApprovalLetter";
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import {getChairmanName} from "../../../../utils/apiCalls/users";
import {RenderComments} from "../../common/RenderComments";
import {useDocDetailsDialogStyles} from "../../../../src/material-styles/docDetailsDialogStyles";
import {RenderDocBasicDetails} from "../../common/RenderDocBasicDetails";
import {RenderDocumentAttachments} from "../../common/RenderDocumentAttachments";
import ErrorSnackBar from "../../../snakbars/ErrorSnackBar";
import DialogTitleComponent from "../../../DialogTitleComponent";
import UserContext from "../../../../context/user/user-context";
import {fetchMarksDistributionAPI} from "../../../../utils/apiCalls/projects";



const VisionDocDetailsDialog = ({currentDocument,open,handleClose,setCurrentDocument}) => {
    const classes = useDocDetailsDialogStyles();
    const visionDocsContext = useContext(VisionDocsContext);
    const [changeStatus,setChangeStatus] = useState('No Change');
    const [commentText,setCommentText] = useState('');
    const [confirmDialog,setConfirmDialog] = useState(false);
    const [confirmDialogLoading,setConfirmDialogLoading] = useState(false);
    const [successSnackbar,setSuccessSnackbar] = useState(false);
    const [letterViewer,setLetterViewer] = useState(false);
    const [success, setSuccess] = useState(false);
    const [chairmanName,setChairmanName]= useState('');
    const [marks,setMarks] = useState('');
    const [saveButton,setSaveButton]= useState(true);
    const userContext = useContext(UserContext);
    const [marksDistribution,setMarksDistribution] = useState( 10);
    const [marksConfirm,setMarksConfirm] = useState(false);
    const [resError,setResError] = useState({
        show:false,
        message:''
    });
    useEffect(()=>{
        if (!currentDocument.details.marks || !currentDocument.details.marks.visionDocument){
            fetchMarksDistributionAPI()
                .then(result =>{
                    setMarksDistribution(result.proposal)
                })
                .catch(error => console.error(error.message))
        }

    },[]);
    const handleMarksChange = event =>{
        if (event.target.value === ''){
            setSaveButton(true)
        }else{
            setSaveButton(false)
        }

        setMarks(event.target.value);
    };
    const openLetterViewer = ()=>{
        getChairmanName()
            .then(result=>{
                if (result.name){
                    setChairmanName(result.name);
                }
                else {
                    setChairmanName('Not Available Yet')
                }
                setLetterViewer(true);
            })
            .catch(error => {
                setResError({
                    show:true,
                    message:'Error while fetching Chairman Info'
                })
            })


    };
    const handleChangeStatus = e =>{
        setChangeStatus(e.target.value)
    };
    const handleCommentChange = e =>{
        setCommentText(e.target.value)
    };
    const handleCloseConfirmDialog = ()=>{
        setConfirmDialog(false);
    };

    const handleMarksSave = ()=>{
        if (marks < 0 || marks > marksDistribution){
            setMarksConfirm(false);
            setResError({show:true,message:`Should be between 0-${marksDistribution}`});
            return;
        }
        visionDocsContext.addMarks(marks,currentDocument._id)
            .then(res => {
                setMarksConfirm(false);
                setSuccessSnackbar(true);
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
            .catch(err =>{
                setResError({
                    show:true,
                    message:'Something went wrong please try again'
                })
            })
    };


    const handleComment = ()=>{
        if (commentText !== ''){
            const commentDetails = {
                text:commentText,
                projectId:currentDocument._id,
                documentId:currentDocument.documentation.visionDocument._id,
                author:userContext.user.user._id
            };
            visionDocsContext.comment(commentDetails)
                .then(res =>{
                    const a = currentDocument.documentation.visionDocument.comments.push({
                        text:commentText,
                        createdAt:Date.now(),
                        author:{
                            name:userContext.user.user.name,
                            role:userContext.user.user.role,
                            profileImage:userContext.user.user.profileImage
                        }
                    });
                    setCurrentDocument({
                        ...currentDocument,
                        a
                    })
                })
                .catch(err =>{
                    setResError({
                        show:true,
                        message:'Something went wrong please try again'
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
        };
        visionDocsContext.changeStatus(statusDetails)
            .then(res =>{
                if (changeStatus === 'Approved' || changeStatus === 'Approved With Changes'){
                    visionDocsContext.assignSupervisorAuto(currentDocument._id,currentDocument.documentation.visionDocument.title,currentDocument.students[0].student_details.regNo)
                        .then(result => {
                            if (result.error){
                                setResError({
                                    show:true,
                                    message:result.error
                                });
                                return;
                            }

                            setCurrentDocument({...currentDocument,
                                details:{
                                ...currentDocument.details,
                                    supervisor:result.supervisor,
                                    acceptanceLetter: result.acceptanceLetter
                                },
                                documentation:{
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
                        .catch(err =>{
                            setResError({
                                show:true,
                                message:'Something went wrong please try again'
                            })
                        })
                }else {
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
                }



            })
            .catch(err =>{
                setResError({
                    show:true,
                    message:'Something went wrong please try again'
                })
            })
    };
    const closeSnackbar = ()=>{
        setSuccessSnackbar(false);
    };

    const closeLetterViewer = ()=>{
        setLetterViewer(false)
    };
    return (
        <div>
            <SuccessSnackBar open={successSnackbar} message={'Success'} handleClose={closeSnackbar}/>
            <ErrorSnackBar open={resError.show} message={resError.message} handleSnackBar={()=>setResError({show:false,message:''})}/>
            <Dialog
                fullWidth
                maxWidth='lg'
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
            >

                <DialogTitleComponent title={currentDocument.documentation.visionDocument.title} handleClose={handleClose}/>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>

                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip style={getVisionDocsStatusChipColor(currentDocument.documentation.visionDocument.status)} label={currentDocument.documentation.visionDocument.status}  size="small"/>
                            </div>
                            {
                                isAuthenticated().user.additionalRole === 'UGPC_Member' &&
                                <div className={classes.detailsContent}>
                                    <Typography color='textSecondary'>
                                        Change Status
                                    </Typography>
                                    <FormControl variant="outlined" margin='dense' className={classes.formControl}>
                                        <InputLabel  htmlFor="changeStatus">
                                            Status
                                        </InputLabel>
                                        <Select
                                            value={changeStatus}
                                            onChange={handleChangeStatus}
                                            input={<OutlinedInput labelWidth={47} name="changeStatus" id="changeStatus" />}
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
                                                currentDocument.documentation.visionDocument.status === 'Meeting Scheduled' &&
                                                <MenuItem value='Approved for Meeting'>Re Schedule</MenuItem>
                                            }
                                            {
                                                currentDocument.documentation.visionDocument.status !== 'Approved' && currentDocument.documentation.visionDocument.status !== 'Approved With Changes' &&
                                                <MenuItem value='Rejected'>Reject</MenuItem>
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            <RenderDocBasicDetails
                                project={currentDocument}
                                currentDocument={currentDocument.documentation.visionDocument}
                                />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RenderDocumentAttachments documents={currentDocument.documentation.visionDocument.documents} />
                            {
                                (currentDocument.documentation.visionDocument.status === 'Approved' || currentDocument.documentation.visionDocument.status === 'Approved With Changes') &&
                                <div className={classes.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        Marks
                                    </Typography>
                                    {
                                        currentDocument.details.marks && currentDocument.details.marks.visionDocument ?
                                            <Container>
                                                <Typography variant='h6' color='textSecondary'>{`(${currentDocument.details.marks.visionDocument}/${marksDistribution})`}</Typography>
                                            </Container>
                                             :
                                            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                                <TextField
                                                    label="Add Marks"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={marks}
                                                    onChange={handleMarksChange}
                                                    placeholder={`0-${marksDistribution}`}
                                                />
                                                <Button onClick={()=>setMarksConfirm(true)} disabled={saveButton} style={{marginLeft:2}} variant='outlined' color='primary'>Save</Button>
                                            </div>
                                    }

                                </div>
                            }
                            <div className={classes.detailsContent}>
                                <RenderComments comments={currentDocument.documentation.visionDocument.comments}/>
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
                        (currentDocument.documentation.visionDocument.status === 'Approved' || currentDocument.documentation.visionDocument.status === 'Approved With Changes') &&(
                            currentDocument.details && currentDocument.details.acceptanceLetter.name &&
                                <Button onClick={openLetterViewer} >View Acceptance Letter</Button>
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
                    <Button onClick={handleCloseConfirmDialog}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color='primary'>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={letterViewer} onClose={closeLetterViewer} fullScreen>
                <AppBar className={classes.appBar}>
                    <Toolbar>

                        <Typography variant="h6" className={classes.title} noWrap>
                            Auto Generated Acceptance Letter
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={closeLetterViewer} aria-label="close">
                            <CloseIcon />
                        </IconButton>
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
            <Dialog maxWidth='xs' fullWidth open={marksConfirm} onClose={()=>setMarksConfirm(false)}>
                <DialogTitleComponent title='Confirm' handleClose={()=>setMarksConfirm(false)}/>
                <DialogContent dividers>
                    <Typography variant='caption' component='span'>Note: </Typography>
                    <Typography variant='body2' component='span'> You cannot change marks after adding!</Typography>
                    <Typography variant='subtitle1' component='div'>Are you sure you want to continue?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setMarksConfirm(false)} >
                        Cancel
                    </Button>
                    <Button onClick={handleMarksSave} color='primary'>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
};

export default VisionDocDetailsDialog;