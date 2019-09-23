import React, {useContext, useState} from 'react';
import ProjectContext from "../../context/project/project-context";
import {Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {DashboardOutlined} from "@material-ui/icons";
import {Chart} from "react-google-charts";
import CircularLoading from "../loading/CircularLoading";
import {formatRoadmapSprintData} from "../coordinator/presentations/formatData";
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
                                    {
                                        !empty ?
                                            <Chart
                                                width={'100%'}
                                                height={'400px'}
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
                                                    height:400,
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