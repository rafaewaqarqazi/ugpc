import React from 'react';
import {getBacklogTaskPriorityColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {Typography, Grid, Tooltip, Zoom, Chip, } from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import UserAvatarComponent from "../../UserAvatarComponent";

const useStyles = makeStyles(theme=>({
    listItem:{
        backgroundColor:'rgba(255,255,255,0.5)',
        padding:theme.spacing(0.5),
        '&:hover':{
            boxShadow:theme.shadows[8]
        },
        borderRadius:'4px 0 0 4px',
    },
    assignees:{
        display:'flex',
        flexDirection:'row'
    }
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
                    <div className={classes.assignees}>
                        {
                            task.assignee.map((student,index) =>(
                                <UserAvatarComponent user={student} key={index}/>
                            ))
                        }
                    </div>

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