import React from 'react';
import {getSprintTaskPriorityColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {makeStyles, Typography, Grid, Tooltip, Zoom, Chip, Divider, Badge} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {getRandomColor} from "../../../src/material-styles/randomColors";

const useStyles = makeStyles(theme=>({
    listItem:{
        backgroundColor:'rgba(255,255,255,0.5)',
        padding:theme.spacing(1.2),
        boxShadow:theme.shadows[1],
        '&:hover':{
            boxShadow:theme.shadows[8]
        },
        display:'flex',

        alignItems:'center'
    },
    description:{
        display:'-webkit-box',
        '-webkit-line-clamp':2,
        '-webkit-box-orient': 'vertical',
        overflow:'hidden',
        textOverflow:'ellipsis',
    },
    avatar:{
        marginRight:theme.spacing(0.2),
        width:30,
        height:30,
        backgroundColor: getRandomColor(),
    },
}))
const RenderSprintTaskItem = ({task}) => {
    const classes = useStyles();
    return (
        <div className={classes.listItem} style={getSprintTaskPriorityColor(task.priority)} >
            <Grid container spacing={1} alignItems='center'>
                <Grid item xs={12} sm={12}>
                    <Typography variant='h6'noWrap>{task.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' color='textSecondary' className={classes.description} >{task.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={6}>
                    <Badge badgeContent={task.subTasks.length > 0 ? task.subTasks.length : '0'} max={10} color='secondary'>
                        <Typography noWrap>Sub Tasks</Typography>
                    </Badge>
                </Grid>
                <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'flex-end'}}>
                    {
                        task.assignee.map((student,index) =>(
                            <Tooltip key={index} title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                <Avatar className={classes.avatar} >{student.name.charAt(0).toUpperCase()}</Avatar>
                            </Tooltip>
                        ))
                    }
                </Grid>


            </Grid>

        </div>

    );
};

export default RenderSprintTaskItem;