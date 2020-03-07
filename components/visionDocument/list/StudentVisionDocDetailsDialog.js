import React, {useContext, useState} from 'react';
import {
  Button,
  Chip, Dialog, DialogActions,
  DialogContent,
  Tooltip,
  IconButton, InputAdornment,
  Menu, MenuItem,
  TextField,
  Typography, ListItemIcon, AppBar, Toolbar,
  Grid, Hidden, CircularProgress,
} from "@material-ui/core";
import {Assignment, Send, AttachFile, PictureAsPdfOutlined, GetAppOutlined} from "@material-ui/icons";
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
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import {PDFDownloadLink, PDFViewer} from '@react-pdf/renderer';
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {useDialogStyles} from "../../../src/material-styles/dialogStyles";
import ProjectContext from "../../../context/project/project-context";

const StudentVisionDocDetailsDialog = ({currentDocument, open, handleClose, setCurrentDocument, project}) => {
  const classes = useDocDetailsDialogStyles();
  const dialogClasses = useDialogStyles();
  const userContext = useContext(UserContext);
  const visionDocsContext = useContext(VisionDocsContext);
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDocUploadDialog, setOpenDocUploadDialog] = useState(false);
  const [openPPTUploadDialog, setOpenPPTUploadDialog] = useState(false);
  const [fileDialogLoading, setFileDialogLoading] = useState(false);
  const [file, setFile] = useState([]);
  const [fileError, setFileError] = useState(false);
  const [letterViewer, setLetterViewer] = useState(false);
  const [chairmanName, setChairmanName] = useState('Not Available Yet');
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const projectContext = useContext(ProjectContext);
  const [resError, setResError] = useState({
    show: false,
    message: ''
  });
  const handleClickAttachDocumentMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAttachDocumentMenu = () => {
    setAnchorEl(null);
  };
  const handleCommentChange = e => {
    setComment(e.target.value)
  };
  const handleComment = () => {
    if (comment.trim() !== '') {
      const commentDetails = {
        text: comment,
        projectId: project._id,
        documentId: currentDocument._id,
        author: userContext.user.user._id
      };
      visionDocsContext.comment(commentDetails)
        .then(res => {
          setComment('')
          const a = currentDocument.comments.push({
            text: comment,
            createdAt: Date.now(),
            author: {
              _id: userContext.user.user._id,
              name: userContext.user.user.name,
              role: userContext.user.user.role,
              profileImage: userContext.user.user.profileImage
            }
          });
          setCurrentDocument({
            ...currentDocument,
            a
          })
        })
    }

  };
  const handleDropZone = files => {
    setFileError(false);
    setFile(files[0])
  };
  const editComment = (commentId, commentText, documentId) => {
    setCurrentDocument({
      ...currentDocument,
      comments: currentDocument.comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            text: commentText
          }
        } else return comment
      })
    });
    projectContext.editComment({commentId, text: commentText, documentId})
  };
  const deleteComment = (commentId, documentId) => {
    setCurrentDocument({
      ...currentDocument,
      comments: currentDocument.comments.filter(comment => comment._id !== commentId)
    })
    projectContext.deleteComment({commentId, documentId})
  }
  const handleOnCloseDocDialog = () => {
    setOpenDocUploadDialog(false);
  };
  const handleOnClosePPTDialog = () => {
    setOpenPPTUploadDialog(false)
  };
  const closeLetterViewer = () => {
    setLetterViewer(false)
  };
  const openLetterViewer = () => {
    getChairmanName()
      .then(result => {
        if (result.name) {
          setChairmanName(result.name);
        }
        setLetterViewer(true);
      })
      .catch(error => {
        setResError({
          show: true,
          message: 'Could not fetch Chairman Info'
        });
        setLetterViewer(true);
      })


  }
  const handleUploadFile = type => {
    if (file.length === 0) {
      setFileError(true)
    } else {
      setFileDialogLoading(true);
      let formData = new FormData();
      formData.set('file', file)
      formData.set('projectId', project._id);
      formData.set('documentId', currentDocument._id)


      visionDocsContext.submitAdditionFilesVisionDoc(formData, type)
        .then(res => {
          setSuccessSnackbar(true);
          setCurrentDocument({
            ...currentDocument,
            documents: [...currentDocument.documents, {
              originalname: res.originalname,
              filename: res.filename,
              type: res.type
            }]
          })
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
        classes={{paper: dialogClasses.root}}
      >
        <SuccessSnackBar open={successSnackbar} message={'Success'} handleClose={() => setSuccessSnackbar(false)}/>
        <DialogTitleComponent title={currentDocument.title} handleClose={handleClose}/>
        {open && <>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className={classes.detailsContent}>
                  <Typography color='textSecondary'>
                    STATUS
                  </Typography>
                  <Chip style={getVisionDocsStatusChipColor(currentDocument.status)} label={currentDocument.status}
                        size="small"/>
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
                    style={{borderRadius: 0, backgroundColor: '#eee'}}
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
                    <MenuItem onClick={() => setOpenDocUploadDialog(true)}>
                      <ListItemIcon>
                        <PictureAsPdfOutlined/>
                      </ListItemIcon>
                      <Typography variant="inherit" noWrap>
                        ReSubmit Vision Document
                      </Typography>
                    </MenuItem>
                  }

                  {
                    currentDocument.status === 'Meeting Scheduled' &&
                    <MenuItem onClick={() => setOpenPPTUploadDialog(true)}>
                      <ListItemIcon>
                        <Assignment/>
                      </ListItemIcon>
                      <Typography variant="inherit" noWrap>
                        Presentation File
                      </Typography>
                    </MenuItem>
                  }

                </Menu>
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
                          <Tooltip title='Add' placement='top'>
                            <IconButton size='small' onClick={handleComment}>
                              <Send/>
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className={classes.detailsContent}>
                  <RenderComments
                      editComment={editComment}
                      deleteComment={deleteComment}
                      comments={currentDocument.comments} documentId={currentDocument._id} projectId={project._id}/>
                </div>

              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>

            {
              project.details && project.details.acceptanceLetter && project.details.acceptanceLetter.name && (
                <div>
                  <Hidden smUp>
                    <PDFDownloadLink
                      document={
                        <ApprovalLetter
                          title={currentDocument.title}
                          students={project.students}
                          supervisor={project.details.supervisor}
                          date={project.details.acceptanceLetter.issueDate}
                          chairmanName={chairmanName}
                        />
                      }
                      fileName={project.details.acceptanceLetter.name}
                      style={{textDecoration: 'none'}}
                    >
                      {
                        ({loading}) =>
                          (loading ? <CircularProgress/> :
                            <Button size='small' startIcon={<GetAppOutlined/>}>Acceptance Letter</Button>)
                      }
                    </PDFDownloadLink>
                  </Hidden>
                  <Hidden xsDown>
                    <Button onClick={openLetterViewer}>Acceptance Letter</Button>
                  </Hidden>
                </div>

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
        classes={{paper: dialogClasses.root}}
      >
        <DialogContent>
          <DropzoneArea
            onChange={handleDropZone}
            acceptedFiles={['application/pdf']}
            filesLimit={1}
            dropzoneText='Drag and drop document file here or click'
          />
          {fileError && <Typography variant='caption' color='error'>Please Upload File</Typography>}
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleOnCloseDocDialog}>
            Cancel
          </Button>
          <Button color='secondary' onClick={() => handleUploadFile('pdf')}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPPTUploadDialog}
        onClose={handleOnClosePPTDialog}
        maxWidth='md'
        fullWidth
        classes={{paper: dialogClasses.root}}
      >
        <DialogContent>
          <DropzoneArea
            onChange={handleDropZone}
            acceptedFiles={['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']}
            filesLimit={1}
            dropzoneText='Drag and drop Presentation file here or click'
          />
          {fileError && <Typography variant='caption' color='error'>Please Upload File</Typography>}
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleOnClosePPTDialog}>
            Cancel
          </Button>
          <Button color='secondary' onClick={() => handleUploadFile('presentation')}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={letterViewer} onClose={closeLetterViewer} fullScreen>
        <ErrorSnackBar open={resError.show} message={resError.message}
                       handleSnackBar={() => setResError({show: false, message: ''})}/>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} noWrap>
              Auto Generated Acceptance Letter
            </Typography>
            <IconButton edge="start" color="inherit" onClick={closeLetterViewer} aria-label="close">
              <CloseIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent style={{height: 500}}>
          {
            project.details && project.details.acceptanceLetter && (
              <PDFViewer style={{width: '100%', height: '100%'}}>
                <ApprovalLetter
                  title={currentDocument.title}
                  students={project.students}
                  supervisor={project.details.supervisor}
                  date={project.details.acceptanceLetter.issueDate}
                  chairmanName={chairmanName}
                />
              </PDFViewer>
            )
          }

        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentVisionDocDetailsDialog;