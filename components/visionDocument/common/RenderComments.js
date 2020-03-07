import {
  Collapse,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton, Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, InputAdornment, Tooltip, TextField,
  Button
} from "@material-ui/core";
import {ExpandLess, ExpandMore, MoreVert, Edit, Delete, Send} from "@material-ui/icons";
import React, {Fragment, useContext, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import UserAvatarComponent from "../../UserAvatarComponent";
import moment from "moment";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import UserContext from '../../../context/user/user-context'
import DialogTitleComponent from "../../DialogTitleComponent";
const useStyles = makeStyles(theme => ({
  commentList: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  }
}));
export const RenderComments = ({comments, editComment, deleteComment}) => {
  const classes = useStyles();
  const classes1 = useDocDetailsDialogStyles();
  const [showComments, setShowComments] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commentId, setCommentId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const userContext = useContext(UserContext);
  const handleShowComments = e => {
    setShowComments(!showComments);
  };
  const handleClickMenuBtn = (event, cId, cText) => {
    setAnchorEl(event.currentTarget);
    setCommentText(cText)
    setCommentId(cId)
  };
  const handleEditComment = () => {
    setAnchorEl(null);
    setCommentText('');
    setOpenEditDialog(false);
    editComment(commentId, commentText);
  };
  const handleDeleteComment = () => {
    setAnchorEl(null);
    setOpenConfirmDialog(false);
    deleteComment(commentId);
  };
  return (
    <>
      <List>
        <ListItem button onClick={handleShowComments}>
          <ListItemText primary="Show Comments"/>
          {showComments ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.commentList}>
            {
              !comments || comments.length === 0 ?
                <ListItem>
                  <Typography variant='h5' color='textSecondary'>No Comments Yet</Typography>
                </ListItem>
                :
                <Container>
                  {
                    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment, index) => (
                      <Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <UserAvatarComponent user={comment.author}/>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="subtitle2"
                                  color="textPrimary"
                                >
                                  {comment.author.name}
                                </Typography>
                                <Typography component="span" variant='caption' color='textSecondary'>
                                  {` - ${moment(comment.createdAt).format('MMM D, YYYY, h:mm A')}`}
                                </Typography>


                              </React.Fragment>
                            }
                            secondary={
                              <Typography
                                component="div"
                                variant="body2"
                                color="textSecondary"
                                className={classes1.wrapText}
                              >
                                {comment.text}
                              </Typography>
                            }
                          />
                          {
                            userContext.user.user && userContext.user.user._id === comment.author._id &&
                            <ListItemSecondaryAction>
                              <IconButton
                                  edge="end"
                                  size='small'
                                  onClick={(event) => handleClickMenuBtn(event, comment._id, comment.text)}>
                                <MoreVert />
                              </IconButton>
                              <Menu
                                  id="simple-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={() => setAnchorEl(null)}
                              >
                                <MenuItem onClick={() => setOpenEditDialog(true)}>
                                  <ListItemIcon>
                                    <Edit fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary="Edit" />
                                </MenuItem>
                                <MenuItem onClick={() => setOpenConfirmDialog(true)}>
                                  <ListItemIcon>
                                    <Delete fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary="Delete" />
                                </MenuItem>
                              </Menu>
                            </ListItemSecondaryAction>
                          }
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                      </Fragment>
                    ))
                  }
                </Container>
            }
          </List>
        </Collapse>
      </List>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitleComponent handleClose={() => setOpenEditDialog(false)} title='Edit Comment'/>
        <DialogContent>
          <TextField
              label="Edit Comment"
              margin="dense"
              variant="outlined"
              multiline
              fullWidth
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rowsMax="4"
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title='Add' placement='top'>
                        <IconButton size='small' onClick={handleEditComment}>
                          <Send/>
                        </IconButton>
                      </Tooltip>

                    </InputAdornment>
                ),
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button size='small' onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button size='small' color='primary' onClick={handleEditComment}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth='xs' fullWidth>
        <DialogTitleComponent title='Confirm' handleClose={() => setOpenConfirmDialog(false)}/>
        <DialogContent>
          <DialogContentText>Confirm Delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size='small' onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button size='small' color='primary' onClick={handleDeleteComment}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}