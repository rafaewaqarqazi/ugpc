import React from 'react';
import {Grid, GridList, GridListTile, IconButton, Tooltip, Typography, Zoom} from "@material-ui/core";
import {AttachFile} from "@material-ui/icons";
import {serverUrl} from "../../../utils/config";
import RenderSubTasks from "../backlogs/RenderSubTasks";
import Avatar from "@material-ui/core/Avatar";
import {getBacklogTaskPriorityColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "../../../src/material-styles/randomColors";
const useStyles = makeStyles(theme =>({
    wrapText:{
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },
    avatar:{
        marginRight:theme.spacing(0.2),
        width:30,
        height:30,
        backgroundColor: getRandomColor(),
    },
    detailsContent:{
        marginBottom:theme.spacing(2)
    },
    priority:{
        paddingLeft:theme.spacing(1),
        borderRadius:'4px 0 0 4px',
    },
    gridList: {
        width: 350,
        height: 300,
    },
}));
const RenderTaskDetails = ({details}) => {
    const classes = useStyles();
    const getPriority = (priority) => {
        switch (priority) {
            case '1' : return 'Very High';
            case '2' : return 'High';
            case '3' : return 'Normal';
            case '4' : return 'Low';
            case '5' : return 'Very Low'
        }
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <div className={classes.detailsContent}>
                    <Tooltip title='Add Attachments' placement='top'>
                        <IconButton style={{borderRadius:0,backgroundColor:'#e0e0e0'}} size='small' ><AttachFile/></IconButton>
                    </Tooltip>
                </div>

                <div className={classes.detailsContent}>
                    <Tooltip title='Description' placement='top'>
                        <Typography variant='body1' className={classes.wrapText}>
                            {details.description}
                        </Typography>
                    </Tooltip>
                </div>
                <div className={classes.detailsContent}>
                    <Typography variant='subtitle2'>
                        Attachments
                    </Typography>
                    {
                        details.attachments.length === 0 ? (
                            <Typography variant='body1' color='textSecondary' className={classes.wrapText}>
                                No Attachments Found
                            </Typography>
                        ):(
                            <GridList cellHeight={160} className={classes.gridList} cols={3}>
                                {
                                    details.attachments.map(attachment =>
                                        <GridListTile key={attachment.fileName} >
                                            <img src={`${serverUrl}/../images/${attachment.fileName}`} alt={attachment.originalname}/>
                                        </GridListTile>
                                    )
                                }
                            </GridList>

                        )
                    }
                </div>
                <div className={classes.detailsContent}>
                    <Typography variant='subtitle2'>
                        Sub Tasks
                    </Typography>
                    <RenderSubTasks subTasks={details.subTasks}/>
                </div>

            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.detailsContent}>
                    <Typography variant='subtitle2'>
                        Assignee
                    </Typography>
                    <div style={{display:'flex',paddingLeft:5}}>
                        {
                            details.assignee.map((student,index) => (
                                <Tooltip key={index} title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                    <Avatar className={classes.avatar} >{student.name.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
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
                    <Typography className={classes.priority} variant='body1' color='textSecondary' style={getBacklogTaskPriorityColor(details.priority)}>
                        {getPriority(details.priority)}
                    </Typography>
                </div>

            </Grid>
        </Grid>
    );
};

export default RenderTaskDetails;