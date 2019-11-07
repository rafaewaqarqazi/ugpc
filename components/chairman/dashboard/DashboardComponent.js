import React, {useContext} from 'react';
import {Container, Typography} from "@material-ui/core";
import { SupervisorAccountOutlined} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {useProgressStyles} from "../../../src/material-styles/ProgressStyles";
import {defaults, Pie} from 'react-chartjs-2';
import UserContext from "../../../context/user/user-context";
import CircularLoading from "../../loading/CircularLoading";
import { getTotalNoUsers, getUsersChartData, getUsersLabel} from "./values";
import 'chartjs-plugin-colorschemes';
import ProjectsGantt from "../../charts/gantt/ProjectsGantt";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

defaults.global.legend.position = 'right';

const DashboardComponent = ({projects}) => {
    const userContext = useContext(UserContext);
    const classes = useListContainerStyles();
    const progressClasses = useProgressStyles();
    const emptyStyles = useListItemStyles();

    return (
        <div>
            <Container>

                <Typography variant='subtitle1' className={progressClasses.title} color='textSecondary'>Dashboard</Typography>
                {
                    userContext.user.users.isLoading ? <div style={{width:'100%'}}><CircularLoading/> </div> :
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
                                {
                                    getTotalNoUsers(userContext.user.users.allUsers) === 0 ?
                                    <div className={emptyStyles.emptyListContainer}>
                                        <div className={emptyStyles.emptyList}>
                                            No Users Found
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
                                                 }
                                             }}
                                             data={{
                                                 labels:getUsersLabel(userContext.user.users.allUsers),
                                                 datasets:[{
                                                     data:getUsersChartData(userContext.user.users.allUsers),
                                                 }]
                                             }} />
                                }

                            </div>

                        </div>
                }
                <ProjectsGantt projects={projects}/>

            </Container>
        </div>
    );
};

export default DashboardComponent;