import React, {useContext, useState} from 'react';
import ProjectContext from "../../context/project/project-context";
import {Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {DashboardOutlined} from "@material-ui/icons";
import {Chart} from "react-google-charts";
import CircularLoading from "../loading/CircularLoading";
import {formatRoadmapSprintData, getScheduleSprint} from "../coordinator/presentations/formatData";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import UserContext from "../../context/user/user-context";

const ProjectRoadMap = () => {
    const classes = useListContainerStyles();
    const [empty,setEmpty] = useState(false);
    const emptyClasses = useListItemStyles();

    const userContext = useContext(UserContext);
    const handleError = error=>{
        setEmpty(true)
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
                                    <div>
                                        {
                                            getScheduleSprint(project.project.details.sprint) ?
                                                <Typography paragraph>Great! everything is on Schedule</Typography>:
                                                <Typography variant='caption' color='error' paragraph>Some of your sprint's deadline have crossed </Typography>
                                        }
                                    </div>
                                    {
                                        !empty ?
                                            <Chart
                                                width={'100%'}
                                                height={(formatRoadmapSprintData(project.project.details).sprintData.length+1) * 52}
                                                chartType="Gantt"
                                                legendToggle
                                                loader={<CircularLoading/>}
                                                chartEvents={[
                                                    {
                                                        eventName:'error',
                                                        callback:handleError
                                                    }
                                                ]}
                                                data={formatRoadmapSprintData(project.project.details).data}
                                                options={{
                                                    gantt: {
                                                        trackHeight: 30,
                                                        criticalPathEnabled: false,
                                                    }
                                                }}
                                                rootProps={{ 'data-testid': '1' }}
                                            />
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
    );
};

export default ProjectRoadMap;