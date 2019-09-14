import React, {Fragment, useState} from 'react';
import {
    Collapse,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    commentList:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    wrapText:{
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },
}))
const RenderSubTasks = ({subTasks}) => {
    const classes = useStyles();
    const [showSubTasks,setShowSubTasks] = useState(false);
    const handleShowSubTasks = e =>{
        setShowSubTasks(!showSubTasks);
    }
    return (
        <List>
            <ListItem button onClick={handleShowSubTasks}>
                <ListItemText primary="Show SubTasks" />
                {showSubTasks ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={showSubTasks} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.commentList}>
                    {
                        subTasks.length === 0 ?
                            <ListItem>
                                <Typography variant='subtitle2' color='textSecondary'>No SubTasks Added</Typography>
                            </ListItem>
                            :
                            subTasks.map((subTask,index)=>(
                                <Fragment key={index}>
                                    <ListItem alignItems="flex-start" key={index}>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="button"
                                                        display='inline'
                                                        color="textPrimary"
                                                    >
                                                        {subTask.title}
                                                    </Typography>
                                                    <div >
                                                        <Typography variant='caption' color='textSecondary'>
                                                            {subTask.status}
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
                                                    className={classes.wrapText}
                                                >
                                                    {subTask.description}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider  />
                                </Fragment>
                            ))

                    }
                </List>
            </Collapse>
        </List>
    );
};

export default RenderSubTasks;