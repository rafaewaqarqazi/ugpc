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

const useStyles = makeStyles(theme => ({
    commentList:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    avatar:{
        backgroundColor:getRandomColor()
    },
}))
export const RenderComments = ({comments})=>{
    const classes = useStyles();
    const [showComments,setShowComments] = useState(false);
    const handleShowComments = e =>{
        setShowComments(!showComments);
    }
    return (
        <List>
            <ListItem button onClick={handleShowComments}>
                <ListItemText primary="Show Comments" />
                {showComments ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.commentList}>
                    {
                        comments.length === 0 ?
                            <ListItem>
                                <Typography variant='h5' color='textSecondary'>No Comments Yet</Typography>
                            </ListItem>
                            :
                            <Container>
                                {
                                    comments.map((comment)=>(
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
    )
}