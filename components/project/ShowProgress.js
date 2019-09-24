import React from 'react';
import ProjectContext from '../../context/project/project-context'
import {Container, Grid, LinearProgress, Tooltip, Typography, Zoom} from "@material-ui/core";
import {DirectionsRunOutlined, FormatListBulletedOutlined} from "@material-ui/icons";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {makeStyles} from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import {getCompletionPercentage} from "./helpers";
import {Pie} from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';
defaults.global.legend.position = 'right'
const useStyles = makeStyles(theme => ({
    title:{
        marginTop:theme.spacing(2),
        marginBottom:theme.spacing(2),
        fontSize:24
    },
    container:{
        padding:theme.spacing(2),
        marginTop: theme.spacing(2),
        boxShadow: theme.shadows[1],
        borderRadius:5,
        backgroundColor: '#fff'
    },
    containerContent:{
        flexGrow:1,
        paddingLeft:theme.spacing(1),
        textAlign:'right'
    },
    top:{
        display:'flex',
        marginBottom: theme.spacing(1)
    },
    topProgressBarContainer:{
        padding: theme.spacing(2,0),

    },
    progressBar:{
        height:10,
        borderRadius: 10
    }
}))
const ShowProgress = () => {
    const classes = useListContainerStyles();
    const progressClasses = useStyles();
    const getTotalTasksCount = details =>{
        let totaltasks = 0;

        totaltasks += details.backlog.length;
        details.sprint.map(sprint => {
            totaltasks +=sprint.todos.length + sprint.inProgress.length + sprint.inReview.length + sprint.done.length;

        });
        return totaltasks
    };
    const getCompletedTasksCount = details =>{
        let completed = 0;

        details.sprint.map(sprint => {
            completed +=sprint.done.length;
        });
        return completed
    };
    const getSprintsPercentage = details =>{
        let count = 0;
        details.sprint.map(sprint => {
            if (sprint.todos.length === 0 && sprint.inProgress.length === 0 && sprint.inReview.length === 0 && sprint.done.length > 0)
                count +=1;
        });

        return parseFloat(((count / details.sprint.length) * 100).toFixed(2))
    };
    const getSprintDataSet = details =>{
        let todos = 0;
        let inProgress = 0;
        let inReview = 0;
        let done = 0;
        details.sprint.map(sprint => {
            todos +=sprint.todos.length;
            inProgress +=sprint.inProgress.length;
            inReview +=sprint.inReview.length;
            done +=sprint.done.length;
        });

        return [todos,inProgress,inReview,done]
    }
    return (
        <ProjectContext.Consumer>
            {
                ({project}) => {
                   if (project.isLoading){
                       return <LinearProgress/>
                   }
                   if (!project.isLoading){
                       return (
                           <Container>

                               <Typography variant='subtitle1' className={progressClasses.title} color='textSecondary'>Progress</Typography>
                               <Grid container spacing={3}>
                                   <Grid item xs={12} sm={6} >
                                       <div className={progressClasses.container}>
                                           <div className={progressClasses.top}>
                                               <div >
                                                   <div className={classes.topIconBox}>
                                                       <FormatListBulletedOutlined className={classes.headerIcon}/>
                                                   </div>
                                               </div>
                                               <div className={progressClasses.containerContent}>
                                                   <Typography variant='body2' color='textSecondary' > Tasks</Typography>
                                                   <Typography variant='h5' color='textSecondary'>{`${getCompletionPercentage(project.project.details)}%`}</Typography>
                                                   <LinearProgress className={progressClasses.progressBar} variant='determinate' value={getCompletionPercentage(project.project.details)}/>

                                               </div>
                                           </div>
                                           <Divider/>
                                           <div className={progressClasses.topProgressBarContainer}>
                                               <Pie width={50}
                                                    height={150}
                                                    options={{ maintainAspectRatio: false }}
                                                    data={{
                                                   labels:['Total','Completed'],
                                                   datasets:[{
                                                       data:[getTotalTasksCount(project.project.details),getCompletedTasksCount(project.project.details)],
                                                       backgroundColor: [
                                                           '#03a9f4',
                                                           '#4caf50',
                                                       ],
                                                       hoverBackgroundColor: [
                                                           '#039be5',
                                                           '#43a047',
                                                       ]
                                                   }]
                                               }} />
                                           </div>

                                       </div>
                                   </Grid>
                                   <Grid item xs={12} sm={6} >
                                       <div className={progressClasses.container}>
                                           <div className={progressClasses.top}>
                                               <div >
                                                   <div className={classes.topIconBox}>
                                                       <DirectionsRunOutlined className={classes.headerIcon}/>
                                                   </div>
                                               </div>
                                               <div className={progressClasses.containerContent}>

                                                   <Typography variant='body2' color='textSecondary' >Sprints</Typography>
                                                   <Typography variant='h5' color='textSecondary'>{`${getSprintsPercentage(project.project.details)}%`}</Typography>
                                                   <LinearProgress className={progressClasses.progressBar} variant='determinate' value={getSprintsPercentage(project.project.details)}/>

                                               </div>
                                           </div>
                                           <Divider/>
                                           <div className={progressClasses.topProgressBarContainer}>
                                               <Pie
                                                   width={50}
                                                   height={150}
                                                   options={{ maintainAspectRatio: false }}
                                                   data={{
                                                   labels:['Todos','In Progress', 'In Review', 'Done'],
                                                   datasets:[{
                                                       data:getSprintDataSet(project.project.details),
                                                       backgroundColor: [
                                                           '#03a9f4',
                                                           '#ffeb3b',
                                                           '#ff9800',
                                                           '#4caf50',
                                                       ],
                                                       hoverBackgroundColor: [
                                                           '#039be5',
                                                           '#fdd835',
                                                           '#fb8c00',
                                                           '#43a047',
                                                       ]
                                                   }]
                                               }} />

                                           </div>
                                       </div>
                                   </Grid>
                               </Grid>

                           </Container>
                       )
                   }
                }
            }
        </ProjectContext.Consumer>
    );
};

export default ShowProgress;