import React, {useContext} from "react";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import UserContext from '../../context/user/user-context';
import {LaptopOutlined} from "@material-ui/icons";
import router from 'next/router';
import {
    Typography,
    Container,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Zoom,
    Tooltip, LinearProgress
} from "@material-ui/core";

import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import CircularLoading from "../../components/loading/CircularLoading";
import moment from "moment";
import {getCompletionPercentage} from "../../components/project/helpers";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import UserAvatarComponent from "../../components/UserAvatarComponent";
import {useTableStyles} from "../../src/material-styles/tableStyles";


const SupervisorProjects = () => {
    const classes = useListContainerStyles();
    const userContext = useContext(UserContext);
    const tableClasses = useTableStyles();
    const emptyStyles = useListItemStyles();
    const handleClickProject = projectId=>{
        router.push(`/supervisor/project/[projectId]/roadmap`,`/supervisor/project/${projectId}/roadmap`)
    };

    return (
        <SupervisorLayout>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <LaptopOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>{'My Projects'}</Typography>
                        </div>
                    </div>
                    {
                        userContext.user.isLoading ? <CircularLoading/> :
                            userContext.user.user &&
                            userContext.user.user.supervisor_details &&
                            userContext.user.user.supervisor_details.projects &&
                            userContext.user.user.supervisor_details.projects.length === 0 ?
                                <div className={emptyStyles.emptyListContainer}>
                                    <div className={emptyStyles.emptyList}>
                                        No Projects Assigned Yet
                                    </div>
                                </div> :
                                <div className={tableClasses.tableWrapper}>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Title</TableCell>
                                                <TableCell align="left">Department</TableCell>
                                                <TableCell align="left">Completion Status</TableCell>
                                                <TableCell align="left">students</TableCell>
                                                <TableCell align="left">Started On</TableCell>
                                                <TableCell align="left">Deadline</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {
                                                userContext.user.user.supervisor_details.projects && userContext.user.user.supervisor_details.projects.length === 0 ?
                                                <TableRow >
                                                    <TableCell colSpan={6}>
                                                        <div className={emptyStyles.emptyListContainer}>
                                                            <div className={emptyStyles.emptyList}>
                                                                No Projects Found
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>:
                                                    userContext.user.user.supervisor_details.projects && userContext.user.user.supervisor_details.projects.map(({title,project,_id},index) => (
                                                    <Tooltip key={index} title='Click to view Details' placement="top" TransitionComponent={Zoom}>
                                                        <TableRow className={tableClasses.tableRow} onClick={()=>handleClickProject(project._id)}>
                                                            <TableCell align="left">
                                                                {title}
                                                            </TableCell>
                                                            <TableCell align="left">{project.department}</TableCell>
                                                            <TableCell >
                                                                <Tooltip  title={`${getCompletionPercentage(project.details)}%`} placement="top" TransitionComponent={Zoom}>
                                                                    <LinearProgress variant='determinate' value={getCompletionPercentage(project.details)} style={{height:8,borderRadius:10}}/>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <div style={{display:'flex'}}>
                                                                    {
                                                                        project.students.map((student,index) =>
                                                                            <UserAvatarComponent user={student} key={index}/>
                                                                        )
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                            <TableCell align="left">{moment(project.details.acceptanceLetter.issueDate).format('LL')}</TableCell>
                                                            <TableCell align="left">{moment(project.details.estimatedDeadline).format('LL')}</TableCell>
                                                        </TableRow>
                                                    </Tooltip>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>

                    }

                </div>
            </Container>
        </SupervisorLayout>
    );
};

export default withSupervisorAuthSync(SupervisorProjects);