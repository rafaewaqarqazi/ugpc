import React, {useContext, useState} from 'react';
import {
    Button,
    Chip,Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, InputAdornment,
    Menu, MenuItem,
    TextField,
    Typography, ListItemIcon, AppBar, Toolbar,
    Grid,
} from "@material-ui/core";
import {isAuthenticated} from "../../../auth";
import {Assignment, Send, AttachFile, PictureAsPdfOutlined} from "@material-ui/icons";
import VisionDocsContext from "../../../context/visionDocs/visionDocs-context";
import {getVisionDocsStatusChipColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {DropzoneArea} from "material-ui-dropzone";
import CloseIcon from '@material-ui/icons/Close';
import ApprovalLetter from "../../approvalLetter/ApprovalLetter";
import {getChairmanName} from "../../../utils/apiCalls/users";
import {RenderComments} from "../common/RenderComments";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import {RenderDocBasicDetails} from "../common/RenderDocBasicDetails";
import {RenderDocumentAttachments} from "../common/RenderDocumentAttachments";
import DialogTitleComponent from "../../DialogTitleComponent";
import UserContext from '../../../context/user/user-context';

const StudentVisionDocDetailsDialog = ({currentDocument,open,handleClose,setCurrentDocument,project}) => {
    const classes = useDocDetailsDialogStyles();
    const userContext = useContext(UserContext);
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
    };
    const handleCloseAttachDocumentMenu = ()=> {
        setAnchorEl(null);
    };
    const handleCommentChange = e =>{
        setComment(e.target.value)
    };
    const handleComment = ()=>{
        if (comment !== ''){
            const commentDetails = {
                text:comment,
                projectId:project._id,
                documentId:currentDocument._id,
                author:userContext.user.user._id
            };
            visionDocsContext.comment(commentDetails)
                .then(res =>{
                    const a = currentDocument.comments.push({
                        text:comment,
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
            formData.set('projectId',project._id);
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
            maxWidth='lg'
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title"
        >

            <DialogTitleComponent title={currentDocument.title} handleClose={handleClose}/>
            {open && <>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip style={getVisionDocsStatusChipColor(currentDocument.status)} label={currentDocument.status}  size="small"/>
                            </div>
                            <RenderDocBasicDetails
                                currentDocument={currentDocument}
                                project={project}
                                />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RenderDocumentAttachments documents={currentDocument.documents}/>
                            {
                                (currentDocument.status === 'Meeting Scheduled' || currentDocument.status === 'Approved With Changes') &&
                                <IconButton
                                    aria-controls="attachment-menu"
                                    aria-haspopup="true"
                                    onClick={handleClickAttachDocumentMenu}
                                    style={{borderRadius:0,backgroundColor:'#eee'}}
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
                                    currentDocument.status === 'Approved With Changes' &&
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
                            <div className={classes.detailsContent}>
                                <RenderComments comments={currentDocument.comments}/>
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