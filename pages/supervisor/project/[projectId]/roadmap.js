import React, {useContext, useState} from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";
import { Chart } from "react-google-charts";
import {Container, LinearProgress, Typography,Button} from "@material-ui/core";
import {DashboardOutlined} from "@material-ui/icons";
import ProjectContext from '../../../../context/project/project-context';
import {useListContainerStyles} from "../../../../src/material-styles/listContainerStyles";
import {
    formatRoadmapProjectData,
    formatRoadmapSprintData
} from "../../../../components/coordinator/presentations/formatData";
import CircularLoading from "../../../../components/loading/CircularLoading";
import {useListItemStyles} from "../../../../src/material-styles/listItemStyles";
import UserContext from '../../../../context/user/user-context';
import {makeStyles} from "@material-ui/styles";


const Roadmap = () => {
    const router = useRouter();

    const userContext = useContext(UserContext);
    const {projectId} = router.query;
    const classes = useListContainerStyles();
    const [empty,setEmpty] = useState(false);
    const emptyClasses = useListItemStyles();
    const handleError = error=>{
        setEmpty(true)
    }
    return (
        <ProjectState>
            <SupervisorProjectLayout projectId={projectId}>
                {/*<ProjectRoadMap/>*/}
                <ProjectContext.Consumer>
                    {
                        ({project}) => {
                            if (project.isLoading){
                                return <LinearProgress/>
                            }
                            if (!project.isLoading){
                                return (
                                    <Container >
                                        <div className={classes.listContainer}>
                                            <div className={classes.top}>
                                                <div className={classes.topIconBox} >
                                                    <DashboardOutlined className={classes.headerIcon}/>
                                                </div>
                                                <div className={classes.topTitle} >
                                                    <Typography variant='h5'>Roadmap</Typography>
                                                </div>
                                            </div>
                                            {
                                                !empty ?
                                                    <div >


                                                        <Chart
                                                            width={'100%'}

                                                            chartType="Gantt"
                                                            loader={<CircularLoading/>}
                                                            chartEvents={[
                                                                {
                                                                    eventName:'error',
                                                                    callback:handleError
                                                                }
                                                            ]}
                                                            data={formatRoadmapProjectData(project.project.details)}
                                                            options={{
                                                                animation: {
                                                                    duration: 1000,
                                                                    easing: 'in'
                                                                },
                                                                gantt: {
                                                                    trackHeight: 30,
                                                                    criticalPathEnabled: false,
                                                                },

                                                            }}
                                                            rootProps={{ 'data-testid': '2' }}
                                                        />
                                                        <div style={{maxHeight:400,overflowY:'auto'}}>
                                                            <Chart

                                                                width={'100%'}
                                                                height={'350px'}
                                                                chartType="Gantt"
                                                                loader={<CircularLoading/>}
                                                                chartEvents={[
                                                                    {
                                                                        eventName:'error',
                                                                        callback:handleError
                                                                    }
                                                                ]}
                                                                data={formatRoadmapSprintData(project.project.details)}
                                                                options={{

                                                                    animation: {
                                                                        duration: 1000,
                                                                        easing: 'in'
                                                                    },
                                                                    gantt: {
                                                                        trackHeight: 30,
                                                                        criticalPathEnabled: false,
                                                                    }
                                                                }}
                                                                rootProps={{ 'data-testid': '1' }}
                                                            />
                                                        </div>


                                                    </div>

                                                :
                                                    (
                                                        <div className={emptyClasses.emptyList}>
                                                            <div className={emptyClasses.emptyListContainer}>
                                                                <div className={emptyClasses.emptyList}>
                                                                    <Typography variant='subtitle2' color='textSecondary'>
                                                                        Nothing has Planned Yet!
                                                                    </Typography>
                                                                    {
                                                                        !userContext.user.isLoading && userContext.user.user.role === 'Student' &&
                                                                        <Button variant='outlined' color='primary' style={{marginTop:10}} size='small'>Click To Plan</Button>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </Container>
                                )
                            }
                        }
                    }

                </ProjectContext.Consumer>


            </SupervisorProjectLayout>
        </ProjectState>
    );
};

export default withSupervisorAuthSync(Roadmap);