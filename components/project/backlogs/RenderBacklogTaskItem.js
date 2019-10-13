import React from 'react';
import {getBacklogTaskPriorityColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {Typography, Grid, Tooltip, Zoom, Chip, Avatar, Container} from "@material-ui/core";
import {getRandomColor} from "../../../src/material-styles/randomColors";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme=>({
    listItem:{
        backgroundColor:'rgba(255,255,255,0.5)',
        padding:theme.spacing(1.2),
        '&:hover':{
            boxShadow:theme.shadows[8]
        },
        borderRadius:'4px 0 0 4px',
    },
    avatar:{
        marginRight:theme.spacing(0.2),
        width:30,
        height:30,
        backgroundColor: getRandomColor(),
    },
}))
const RenderBacklogTaskItem = ({task}) => {
    const classes = useStyles();
    return (
        <div className={classes.listItem} style={getBacklogTaskPriorityColor(task.priority)} >
            <Grid container spacing={1} alignItems='center'>
                <Grid item xs={2} sm={2}>
                    <Typography variant='body1' color='textSecondary' noWrap>{task.title}</Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Typography variant='body1' color='textSecondary' noWrap>{task.description}</Typography>
                </Grid>
                <Grid item xs={3} sm={2}>
                    {
                        task.createdBy && (
                            <Tooltip  title='Created By' placement="top" TransitionComponent={Zoom}>
                                <Chip
                                    color='primary'
                                    size='small'
                                    label={task.createdBy.name}
                                />
                            </Tooltip>
                        )
                    }
                </Grid>
                <Grid item xs={2} sm={2}>
                    {
                        task.assignee.map((student,index) =>(
                            <Tooltip key={index} title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                <Avatar className={classes.avatar} >{student.name.charAt(0).toUpperCase()}</Avatar>
                            </Tooltip>
                        ))
                    }
                </Grid>
                <Grid item xs={1} sm={1}>
                    <Tooltip  title='Sub Tasks' placement="top" TransitionComponent={Zoom}>
                        <Chip
                            color='primary'
                            size='small'
                            label={task.subTasks.length}
                        />
                    </Tooltip>
                </Grid>

            </Grid>

        </div>
    );
};

export default RenderBacklogTaskItem;