import React, {useContext, useState} from 'react';
import {
  Dialog, DialogActions,
  Chip,
  DialogContent,
  Grid,
  GridList,
  GridListTile,
  IconButton,
  Tooltip,
  Typography,
  Button, GridListTileBar, LinearProgress, Zoom,
  DialogTitle, DialogContentText, TextField, InputAdornment
} from "@material-ui/core";
import {AttachFile, Delete, Close, Send} from "@material-ui/icons";
import {serverUrl} from "../../../utils/config";
import RenderSubTasks from "../backlogs/RenderSubTasks";
import {getBacklogTaskPriorityColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {makeStyles} from "@material-ui/styles";
import UserAvatarComponent from "../../UserAvatarComponent";
import DialogTitleComponent from "../../DialogTitleComponent";
import {DropzoneArea} from "material-ui-dropzone";
import ProjectContext from "../../../context/project/project-context";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import {RenderComments} from "../../visionDocument/common/RenderComments";
import UserContext from '../../../context/user/user-context';
import {useDialogStyles} from "../../../src/material-styles/dialogStyles";

const useStyles = makeStyles(theme => ({
  wrapText: {
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },

  detailsContent: {
    marginBottom: theme.spacing(2)
  },
  priority: {
    paddingLeft: theme.spacing(1),
    borderRadius: '4px 0 0 4px',
  },
  gridList: {
    height: 300,
  },
  gridListItem: {
    cursor: 'pointer'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
}));
const RenderTaskDetails = ({details, setDetails, taskIn, sprintId}) => {
  const userContext = useContext(UserContext);
  const projectContext = useContext(ProjectContext);
  const classes = useStyles();
  const dialogClasses = useDialogStyles();
  const [openAddAttachmentDialog, setOpenAddAttachmentDialog] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [resError, setResError] = useState({
    show: false,
    message: ''
  });
  const [success, setSuccess] = useState({
    show: false,
    message: ''
  });
  const [removeAttachment, setRemoveAttachment] = useState({
    show: false,
    filename: ''
  });
  const [image, setImage] = useState({
    show: false,
    image: {}
  });
  const handleCommentChange = event => {
    setComment(event.target.value);
  };
  const handleComment = () => {
    if (comment.trim() !== '') {
      const commentDetails = {
        text: comment,
        projectId: projectContext.project.project._id,
        taskId: details._id,
        taskIn,
        sprintId,
        author: userContext.user.user._id
      };
      projectContext.addCommentToTask(commentDetails)
        .then(res => {
          setComment('');
          setDetails({
            ...details,
            discussion: details.discussion ? [
              ...details.discussion,
              {
                text: comment,
                createdAt: Date.now(),
                author: {
                  name: userContext.user.user.name,
                  profileImage: userContext.user.user.profileImage
                }
              }
            ] : [{
              text: comment,
              createdAt: Date.now(),
              author: {
                name: userContext.user.user.name,
                profileImage: userContext.user.user.profileImage
              }
            }]
          });
        })
        .catch(err => {
          setResError({
            show: true,
            message: 'Something went wrong please try again'
          })
        })
    }
  };
  const handleRemoveAttachment = () => {
    const data = {
      filename: removeAttachment.filename,
      projectId: projectContext.project.project._id,
      taskId: details._id,
      taskIn,
      sprintId
    };
    setLoading(true);
    projectContext.removeAttachmentFromTask(data)
      .then(result => {
        setLoading(false);
        setRemoveAttachment({show: false, filename: ''});
        setSuccess({
          show: true,
          message: 'Removed Successfully'
        });
        setDetails({
          ...details,
          attachments: details.attachments.filter(attachment => attachment.filename !== data.filename)
        })
      })
      .catch(err => {
        setResError({
          show: true,
          message: "Something went wrong"
        })
      })
  };
  const handleDropZone = files => {
    setFileError(false);
    setFiles(files)
  };
  const handleUploadAttachments = () => {
    if (files.length === 0) {
      setFileError(true)
    } else {
      setLoading(true);
      const data = new FormData();
      files.map(file => {
        data.append('files', file);
      });

      data.set('projectId', projectContext.project.project._id);
      data.set('taskId', details._id);
      data.set('taskIn', taskIn);
      if (sprintId) {
        data.set('sprintId', sprintId)
      }
      projectContext.addAttachmentsToTask(data, taskIn)
        .then(result => {
          setLoading(false);
          setOpenAddAttachmentDialog(false);
          setSuccess({
            show: true,
            message: 'Uploaded Successfully'
          });
          setDetails({
            ...details,
            attachments: [
              ...details.attachments,
              ...result.files
            ]
          })
        })
        .catch(err => {
          console.log(err.message)
        })
    }

  };
  const getPriority = (priority) => {
    switch (priority) {
      case '1' :
        return 'Very High';
      case '2' :
        return 'High';
      case '3' :
        return 'Normal';
      case '4' :
        return 'Low';
      case '5' :
        return 'Very Low'
    }
  };

  return (
    <div>
      <SuccessSnackBar open={success.show} message={success.message} handleClose={() => setSuccess(false)}/>
      <ErrorSnackBar open={resError.show} message={resError.message}
                     handleSnackBar={() => setResError({show: false, message: ""})}/>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <div className={classes.detailsContent}>
            <Tooltip title='Add Attachments' placement='top' onClick={() => setOpenAddAttachmentDialog(true)}>
              <IconButton style={{borderRadius: 0, backgroundColor: '#e0e0e0'}}
                          disabled={details.attachments.length === 20} size='small'><AttachFile/></IconButton>
            </Tooltip>
          </div>

          <div className={classes.detailsContent}>
            <Tooltip title='Description' placement='top'>
              <Typography variant='body1' className={classes.wrapText}>
                {details.description}
              </Typography>
            </Tooltip>
          </div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2'>
              Status
            </Typography>
            <Chip label={details.status} color='primary'/>
          </div>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2'>
              Assignee
            </Typography>
            <div style={{display: 'flex', paddingLeft: 5}}>
              {
                details.assignee.map((student, index) => (
                  <UserAvatarComponent user={student} key={index}/>
                ))
              }
            </div>
          </div>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2' noWrap>
              Story Point Estimate
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              {details.storyPoints}
            </Typography>
          </div>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2' noWrap>
              Priority
            </Typography>
            <Typography className={classes.priority} variant='body1' color='textSecondary'
                        style={getBacklogTaskPriorityColor(details.priority)}>
              {getPriority(details.priority)}
            </Typography>
          </div>

        </Grid>
        <Grid item xs={12}>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2'>
              Discussion
            </Typography>

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

            <RenderComments comments={details.discussion}/>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2'>
              Sub Tasks
            </Typography>
            <RenderSubTasks subTasks={details.subTasks}/>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.detailsContent}>
            <Typography variant='subtitle2'>
              Attachments
            </Typography>
            {
              details.attachments.length === 0 ? (
                <Typography variant='body1' color='textSecondary' className={classes.wrapText}>
                  No Attachments Found
                </Typography>
              ) : (
                <GridList cellHeight={160} className={classes.gridList} cols={3}>

                  {
                    details.attachments.map((attachment, index) =>
                      <GridListTile
                        key={attachment.filename}
                        cols={index === 0 || index === 6 ? 2 : 1}

                      >
                        <img className={classes.gridListItem} onClick={() => setImage({show: true, image: attachment})}
                             src={`${serverUrl}/../images/${attachment.filename}`}
                             alt={attachment.originalname}/>
                        <GridListTileBar
                          title={attachment.originalname}
                          actionIcon={
                            <Tooltip title='Remove' placement="top" TransitionComponent={Zoom}>
                              <IconButton aria-label={`remove ${attachment.originalname}`} className={classes.icon}
                                          size='small' onClick={() => setRemoveAttachment({
                                show: true,
                                filename: attachment.filename
                              })}>
                                <Delete/>
                              </IconButton>
                            </Tooltip>
                          }
                        />
                      </GridListTile>
                    )
                  }
                </GridList>

              )
            }
          </div>
        </Grid>
      </Grid>
      <Dialog open={openAddAttachmentDialog} onClose={() => setOpenAddAttachmentDialog(false)} fullWidth maxWidth='sm'
              classes={{paper: dialogClasses.root}}>
        {loading && <LinearProgress/>}
        <DialogTitleComponent title='Add Attachments' handleClose={() => setOpenAddAttachmentDialog(false)}/>
        <DialogContent dividers>
          <DropzoneArea
            onChange={handleDropZone}
            acceptedFiles={['image/*']}
            filesLimit={20 - details.attachments.length}
            maxFileSize={6000000}
            showPreviews={true}
            showPreviewsInDropzone={false}
            dropzoneText={`Drag and drop Images here or click (Max ${20 - details.attachments.length})`}
          />
          {fileError && <Typography variant='caption' color='error'>Please Upload Images</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAttachmentDialog(false)}>Cancel</Button>
          <Button color='primary' onClick={handleUploadAttachments}>Add</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={removeAttachment.show} onClose={() => setRemoveAttachment({show: false, filename: ''})} fullWidth
              maxWidth='sm' classes={{paper: dialogClasses.root}}>
        {loading && <LinearProgress/>}
        <DialogTitleComponent title='Confirm' handleClose={() => setRemoveAttachment({show: false, filename: ''})}/>
        <DialogContent dividers>
          <DialogContentText>Are you sure you want to remove this attachment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveAttachment({show: false, filename: ''})}>Cancel</Button>
          <Button color='primary' onClick={handleRemoveAttachment}>Remove</Button>
        </DialogActions>
      </Dialog>
      {
        image.show &&
        <Dialog open={image.show} onClose={() => setImage({show: false, image: {}})} fullWidth maxWidth='lg'
                classes={{paper: dialogClasses.root}}>
          <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
            <Typography variant='h6' noWrap style={{flexGrow: 1}}>{image.image.originalname}</Typography>
            <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
              <IconButton size='small' onClick={() => setImage({show: false, image: {}})}>
                <Close/>
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <img
            style={{maxWidth: '100%', height: 'auto'}}
            src={`${serverUrl}/../static/images/${image.image.filename}`}
            alt={image.image.originalname}
          />
        </Dialog>
      }
    </div>

  );
};

export default RenderTaskDetails;