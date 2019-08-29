import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Chip, Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton, InputAdornment,
    InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {isAuthenticated} from "../../../../auth";
import Avatar from "@material-ui/core/Avatar";
import {serverUrl} from "../../../../utils/config";
import {Assignment, PictureAsPdfOutlined, Send} from "@material-ui/icons";
import VisionDocsContext from "../../../../context/visionDocs/visionDocs-context";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import {getVisionDocsStatusChipColor} from "../../../../src/material-styles/visionDocsListBorderColor";

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
        maxWidth:400,
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },

}));
const VisionDocDetailsDialog = ({currentDocument,open,handleClose,setCurrentDocument,inputLabel,labelWidth}) => {
    const classes = useStyles();
    const visionDocsContext = useContext(VisionDocsContext);
    const [changeStatus,setChangeStatus] = useState('No Change');
    const [commentText,setCommentText] = useState('');
    const handleChangeStatus = e =>{
        setChangeStatus(e.target.value)
    };
    const handleCommentChange = e =>{
        setCommentText(e.target.value)
    };
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
        const statusDetails = {
            status:changeStatus,
            projectId:currentDocument._id,
            documentId:currentDocument.documentation.visionDocument._id,
        }
        visionDocsContext.changeStatus(statusDetails)
            .then(res =>{
                setCurrentDocument({...currentDocument,documentation:{
                        ...currentDocument.documentation,
                        visionDocument: {
                            ...currentDocument.documentation.visionDocument,
                            status:changeStatus
                        }
                    }})
            })
    };
    return (
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
                                <Chip color='primary' style={getVisionDocsStatusChipColor(currentDocument.documentation.visionDocument.status)} label={currentDocument.documentation.visionDocument.status}  size="small"/>
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


                                            <MenuItem value='Rejected'>Reject</MenuItem>
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
                                        <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                    )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Students
                                </Typography>
                                {
                                    currentDocument.students.map((student,index)=>
                                        <Container key={index}>
                                            <List>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={student.name} src="/static/images/avatar/personAvatar.png" />
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
                                                currentDocument.documentation.visionDocument.documents.map(document =>{
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
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Comments
                                </Typography>
                                {
                                    currentDocument.documentation.visionDocument.comments.length === 0 ?
                                        <Typography variant='h6' color='textSecondary'>
                                            No Comments Yet
                                        </Typography>
                                        :
                                        <Container>
                                            <List className={classes.commentList}>
                                                {
                                                    currentDocument.documentation.visionDocument.comments.map(comment=>

                                                        <ListItem alignItems="flex-start" key={comment._id}>
                                                            <ListItemAvatar>
                                                                <Avatar alt="Cindy Baker" src="/static/images/avatar/personAvatar.png" />
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
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textPrimary"
                                                                        >
                                                                            {comment.text}
                                                                        </Typography>
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
                        changeStatus !== 'No Change' &&
                        <Button onClick={handleConfirm} variant='contained' color='secondary'>
                            Confirm
                        </Button>
                    }
                    <Button onClick={handleClose} color="primary" variant='contained'>
                        Close
                    </Button>
                </DialogActions>
            </>
            }
        </Dialog>
    );
};

export default VisionDocDetailsDialog;