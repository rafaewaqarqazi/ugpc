import React, {useContext, useState} from 'react';
import {Button, Container, Typography} from "@material-ui/core";
import {LaptopOutlined, SupervisorAccountOutlined} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {useProgressStyles} from "../../../src/material-styles/ProgressStyles";
import {defaults, Pie} from 'react-chartjs-2';
import UserContext from "../../../context/user/user-context";
import CircularLoading from "../../loading/CircularLoading";
import {formatProjectsData, getTotalNoUsers, getUsersChartData, getUsersLabel} from "./values";
import 'chartjs-plugin-colorschemes';
import {Chart} from "react-google-charts";
import {formatRoadmapSprintData} from "../../coordinator/presentations/formatData";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

defaults.global.legend.position = 'right';

const DashboardComponent = ({projects}) => {
    const userContext = useContext(UserContext);
    const classes = useListContainerStyles();
    const progressClasses = useProgressStyles();
    const emptyClasses = useListItemStyles();
    const [empty,setEmpty] = useState(false);
    const handleError = error=>{
        setEmpty(true)
    }
    return (
        <div>
            <Container>

                <Typography variant='subtitle1' className={progressClasses.title} color='textSecondary'>Dashboard</Typography>
                {
                    userContext.user.users.isLoading ? <CircularLoading/> :
                        <div className={progressClasses.container}>
                            <div className={progressClasses.top}>
                                <div >
                                    <div className={classes.topIconBox}>
                                        <SupervisorAccountOutlined className={classes.headerIcon}/>
                                    </div>
                                </div>
                                <div className={progressClasses.containerContent}>
                                    <Typography variant='body1' color='textSecondary' >Users</Typography>
                                    <Typography variant='h5' color='textSecondary'>{getTotalNoUsers(userContext.user.users.allUsers)}</Typography>

                                </div>
                            </div>
                            <Divider/>
                            <div className={progressClasses.topProgressBarContainer}>
                                <Pie width={3}
                                     height={1}
                                     options={{
                                         maintainAspectRatio: true,
                                         plugins: {
                                             colorschemes: {
                                                 scheme: 'brewer.SetTwo8'
                                             }
                                         }
                                     }}
                                     data={{
                                         labels:getUsersLabel(userContext.user.users.allUsers),
                                         datasets:[{
                                             data:getUsersChartData(userContext.user.users.allUsers),
                                         }]
                                     }} />
                            </div>

                        </div>
                }
                {
                    projects.isLoading ? <CircularLoading/> :
                        <div className={progressClasses.container}>
                            <div className={progressClasses.top}>
                                <div >
                                    <div className={classes.topIconBox}>
                                        <LaptopOutlined className={classes.headerIcon}/>
                                    </div>
                                </div>
                                <div className={progressClasses.containerContent}>
                                    <Typography variant='body1' color='textSecondary' >Projects</Typography>
                                    <Typography variant='h5' color='textSecondary'>{projects.projects.length}</Typography>

                                </div>
                            </div>
                            <Divider/>
                            <div className={progressClasses.topProgressBarContainer}>
                                {
                                    !empty ?
                                        <Chart
                                            width={'100%'}
                                            height={'100%'}
                                            chartType="Gantt"
                                            loader={<CircularLoading/>}
                                            chartEvents={[
                                                {
                                                    eventName:'error',
                                                    callback:handleError
                                                }
                                            ]}
                                            data={formatProjectsData(projects.projects)}
                                            options={{
                                                height:'100%',
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
                                                            No Projects Found!
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>

                        </div>
                }

            </Container>
        </div>
    );
};

export default DashboardComponent;