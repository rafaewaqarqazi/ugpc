import React from 'react';
import ProjectContext from '../../context/project/project-context'
import {
    Container,
    Grid,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    LinearProgress
} from "@material-ui/core";
import {
    DirectionsRunOutlined,
    FormatListBulletedOutlined,
} from "@material-ui/icons";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import Divider from "@material-ui/core/Divider";
import {
    getCompletedStoryPoints,
    getCompletedTasksCount,
    getCompletionPercentage,
    getSprintDataSet, getSprintLabels,
    getSprintsPercentage, getSprintTableRowBorder, getSprintVelocity, getTotalStoryPoints,
    getTotalTasksCount
} from "./helpers";
import {Bar, Pie} from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';
import {useProgressStyles} from "../../src/material-styles/ProgressStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";

import 'chartjs-plugin-colorschemes';
import moment from "moment";
import {useTableStyles} from "../../src/material-styles/tableStyles";
defaults.global.legend.position = 'right';

const ShowProgress = () => {
    const classes = useListContainerStyles();
    const progressClasses = useProgressStyles();
    const emptyStyles = useListItemStyles();
    const tableClasses = useTableStyles();
    return (
        <ProjectContext.Consumer>
            {
                ({project}) => {
                   if (project.isLoading){
                       return <LinearProgress/>
                   }
                   if (!project.isLoading){
                       return (
                           <Container className={classes.footerMargin}>

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
                                               {
                                                   getTotalTasksCount(project.project.details) === 0?
                                                       <div className={emptyStyles.emptyListContainer}>
                                                           <div className={emptyStyles.emptyList}>
                                                               No Tasks Done yet
                                                           </div>
                                                       </div>:
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
                                               }

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
                                               {
                                                   project.project.details.sprint.length === 0 ?
                                                       <div className={emptyStyles.emptyListContainer}>
                                                           <div className={emptyStyles.emptyList}>
                                                               No Sprint created yet
                                                           </div>
                                                       </div>:
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
                                               }


                                           </div>
                                       </div>
                                   </Grid>
                                   <Grid item xs={12} >
                                       <div className={progressClasses.container}>
                                           <div className={progressClasses.top}>
                                               <div >
                                                   <div className={classes.topIconBox}>
                                                       <DirectionsRunOutlined className={classes.headerIcon}/>
                                                   </div>
                                               </div>
                                               <div className={progressClasses.containerContent}>
                                                   <Typography variant='body2' color='textSecondary' >Sprint Velocity</Typography>
                                                   <Tooltip title='Average Story Points Completed / Sprint' placement='top'>
                                                        <Typography variant='h5' color='textSecondary'>{getSprintVelocity(project.project.details.sprint)}</Typography>
                                                   </Tooltip>
                                               </div>
                                           </div>
                                           <Divider/>
                                           <div className={progressClasses.topProgressBarContainer}>
                                               {
                                                   project.project.details.sprint.length === 0 ?
                                                       <div className={emptyStyles.emptyListContainer}>
                                                           <div className={emptyStyles.emptyList}>
                                                               No Sprint created yet
                                                           </div>
                                                       </div>:
                                                       <Bar
                                                            height={300}
                                                            options={{
                                                                maintainAspectRatio: false,
                                                                plugins: {
                                                                    colorschemes: {
                                                                        scheme: 'brewer.Paired12'
                                                                    }
                                                                },
                                                                scales: {
                                                                    xAxes: [{
                                                                        barPercentage: 0.5,
                                                                        barThickness: 20,

                                                                    }]
                                                                },
                                                                legend:{
                                                                    display:true,
                                                                    position:'top'
                                                                }
                                                            }}
                                                            data={{
                                                                labels:getSprintLabels(project.project.details.sprint),
                                                                datasets:[
                                                                    {
                                                                    label: 'Total Story points',
                                                                    data:getTotalStoryPoints(project.project.details.sprint),
                                                                    },
                                                                    {
                                                                        label: 'Completed Story Points',
                                                                        data:getCompletedStoryPoints(project.project.details.sprint),
                                                                    }
                                                                ]
                                                            }} />
                                               }


                                           </div>
                                       </div>
                                   </Grid>
                                   <Grid item xs={12} >
                                       <div className={progressClasses.container}>
                                           <div className={progressClasses.top}>
                                               <div >
                                                   <div className={classes.topIconBox}>
                                                       <DirectionsRunOutlined className={classes.headerIcon}/>
                                                   </div>
                                               </div>
                                               <div className={progressClasses.containerContent}>
                                                   <Typography variant='body2' color='textSecondary' >Sprints</Typography>
                                                   <Typography variant='h5' color='textSecondary'>{project.project.details.sprint.length}</Typography>
                                               </div>
                                           </div>
                                           <Divider/>
                                           <div className={progressClasses.topProgressBarContainer}>
                                               <div className={tableClasses.tableWrapper}>
                                                   <Table >
                                                       <TableHead>
                                                           <TableRow>
                                                               <TableCell align="left">Name</TableCell>
                                                               <TableCell align="left">StartDate</TableCell>
                                                               <TableCell align="left">EndDate</TableCell>
                                                               <TableCell align="left">Status</TableCell>
                                                               <TableCell align="left">TotalTasks</TableCell>
                                                               <TableCell align="left">CompletedTasks</TableCell>
                                                               <TableCell align="left">CompletedDate</TableCell>
                                                           </TableRow>
                                                       </TableHead>
                                                       <TableBody >
                                                           {

                                                               project.project.details.sprint.length === 0?
                                                                   <TableRow >
                                                                       <TableCell colSpan={7}>
                                                                           <div className={emptyStyles.emptyListContainer}>
                                                                               <div className={emptyStyles.emptyList}>
                                                                                   No Sprint created yet
                                                                               </div>
                                                                           </div>
                                                                       </TableCell>
                                                                   </TableRow>:
                                                                   project.project.details.sprint.map((sprint,index) => (
                                                                       <TableRow key={index} className={tableClasses.tableRow} style={getSprintTableRowBorder(sprint)}>
                                                                           <TableCell align="left" >{sprint.name}</TableCell>
                                                                           <TableCell align="left" >{moment(sprint.startDate).format('MM-DD-YY')}</TableCell>
                                                                           <TableCell align="left" >{moment(sprint.endDate).format('MM-DD-YY')}</TableCell>
                                                                           <TableCell >{sprint.status}</TableCell>
                                                                           <TableCell align="left">{sprint.tasks.length}</TableCell>
                                                                           <TableCell >{sprint.tasks.filter(task => task.status === 'done').length}</TableCell>
                                                                           <TableCell >{sprint.status === 'Completed' ? moment(sprint.completedOn).format('MM-DD-YY') :'InComplete'}</TableCell>
                                                                       </TableRow>
                                                                   ))
                                                           }
                                                       </TableBody>
                                                   </Table>
                                               </div>
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