import React from 'react';
import { Container, Typography,Grid} from "@material-ui/core";
import { SupervisorAccountOutlined,AssignmentOutlined} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {useProgressStyles} from "../../../src/material-styles/ProgressStyles";
import { Pie, Bar} from 'react-chartjs-2';
import CircularLoading from "../../loading/CircularLoading";
import 'chartjs-plugin-colorschemes';
import {getStudentsCount, getVisionDocsCount} from "./values";
import ProjectsGantt from "../../charts/gantt/ProjectsGantt";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";


const CoordinatorDashboard = ({projects ,students,visionDocs}) => {
    const classes = useListContainerStyles();
    const progressClasses = useProgressStyles();
    const emptyStyles = useListItemStyles();
    return (
        <div className={classes.footerMargin}>
            <Container>

                <Typography variant='subtitle1' className={progressClasses.title} color='textSecondary'>Dashboard</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <div className={progressClasses.container}>
                            <div className={progressClasses.top}>
                                <div >
                                    <div className={classes.topIconBox}>
                                        <SupervisorAccountOutlined className={classes.headerIcon}/>
                                    </div>
                                </div>
                                <div className={progressClasses.containerContent}>
                                    <Typography variant='body1' color='textSecondary' >Students</Typography>
                                    {
                                        !students.isLoading &&
                                        <Typography variant='h5' color='textSecondary'>{getStudentsCount(students.students)}</Typography>
                                    }

                                </div>
                            </div>
                            <Divider/>
                            {
                                students.isLoading ? <CircularLoading/> :
                                    <div className={progressClasses.topProgressBarContainer}>
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
                                                 labels:students.students.map(student => student._id).sort((a,b)=>a.slice(1,3)-b.slice(1,3)),
                                                 datasets:[{
                                                     label: 'Students per Batch',
                                                     data:students.students.sort((a,b)=>a._id.slice(1,3)-b._id.slice(1,3)).map(student =>student.students),
                                                 }]
                                             }} />
                                    </div>
                            }


                        </div>
                    </Grid>
                    <Grid item xs={12} >
                        <div className={progressClasses.container}>
                            <div className={progressClasses.top}>
                                <div >
                                    <div className={classes.topIconBox}>
                                        <AssignmentOutlined className={classes.headerIcon}/>
                                    </div>
                                </div>
                                <div className={progressClasses.containerContent}>
                                    <Typography variant='body1' color='textSecondary' >Vision Documents</Typography>
                                    {
                                        !visionDocs.isLoading &&
                                        <Typography variant='h5' color='textSecondary'>{getVisionDocsCount(visionDocs.visionDocs)}</Typography>

                                    }

                                </div>
                            </div>
                            <Divider/>
                            {
                                visionDocs.isLoading ? <CircularLoading/> :
                                    <div className={progressClasses.topProgressBarContainer}>
                                        {
                                            getVisionDocsCount(visionDocs.visionDocs) === 0 ?
                                            <div className={emptyStyles.emptyListContainer}>
                                                <div className={emptyStyles.emptyList}>
                                                    No Projects Found
                                                </div>
                                            </div>:
                                                <Pie width={3}
                                                     height={1}
                                                     options={{
                                                         maintainAspectRatio: true,
                                                         plugins: {
                                                             colorschemes: {
                                                                 scheme: 'brewer.SetTwo8'
                                                             }
                                                         },
                                                         legend:{
                                                             display:true,
                                                             position:'right'
                                                         }
                                                     }}
                                                     data={{
                                                         labels:visionDocs.visionDocs.map(doc => doc._id),
                                                         datasets:[{
                                                             data:visionDocs.visionDocs.map(doc => doc.visionDocs),
                                                         }]
                                                     }} />
                                        }

                                    </div>
                            }


                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <ProjectsGantt projects={projects}/>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default CoordinatorDashboard;