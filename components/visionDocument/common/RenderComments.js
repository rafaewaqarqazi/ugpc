import {
    Collapse,
    Container,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Avatar
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import React, {Fragment, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "../../../src/material-styles/randomColors";
import UserAvatarComponent from "../../UserAvatarComponent";
import moment from "moment";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
const useStyles = makeStyles(theme => ({
    commentList:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    avatar:{
        backgroundColor:getRandomColor()
    },
}));
export const RenderComments = ({comments})=>{
    const classes = useStyles();
    const classes1 = useDocDetailsDialogStyles();
    const [showComments,setShowComments] = useState(false);
    const handleShowComments = e =>{
        setShowComments(!showComments);
    };
    return (
        <List>
            <ListItem button onClick={handleShowComments}>
                <ListItemText primary="Show Comments" />
                {showComments ? <ExpandLess /> : <ExpandMore />}
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
                                    comments.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((comment,index)=>(
                                        <Fragment key={index}>
                                            <ListItem alignItems="flex-start" >
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
                                                            <Typography  component="span" variant='caption' color='textSecondary'>
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
    )
}