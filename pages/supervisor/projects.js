import React, {useContext} from "react";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import ProjectState from "../../context/project/ProjectState";
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
    Tooltip,
    Avatar, LinearProgress
} from "@material-ui/core";

import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import CircularLoading from "../../components/loading/CircularLoading";
import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "../../src/material-styles/randomColors";
import moment from "moment";
import {getCompletionPercentage} from "../../components/project/helpers";

const useStyles = makeStyles(theme =>({
    tableRow:{
        "&:hover":{

            boxShadow:theme.shadows[6]
        }
    },
    avatar:{
        width:30,
        height:30,
        backgroundColor:getRandomColor(),
        fontSize:18
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflowX:'auto'
    }
}));


const Projects = () => {
    const classes = useListContainerStyles();
    const userContext = useContext(UserContext);
    const projectsClasses = useStyles();

    const handleClickProject = projectId=>{
        router.push(`/supervisor/project/[projectId]/roadmap`,`/supervisor/project/${projectId}/roadmap`)
    };

    return (
        <ProjectState>
            <SupervisorLayout>
                <Container>
                    <div className={classes.listContainer}>
                        <div className={classes.top}>
                            <div className={classes.topIconBox} >
                                <LaptopOutlined className={classes.headerIcon}/>
                            </div>
                            <div className={classes.topTitle} >
                                <Typography variant='h5'>Projects</Typography>
                            </div>
                        </div>
                        {
                            userContext.user.isLoading ? <CircularLoading/> :
                                userContext.user.user.supervisor_details.projects.length === 0 ?
                                    <div>no projects</div> :
                                    <div className={projectsClasses.tableWrapper}>
                                        <Table >
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
                                                    userContext.user.user.supervisor_details.projects.map(({title,project,_id},index) => (
                                                        <Tooltip key={index} title='Click to view Details' placement="top" TransitionComponent={Zoom}>
                                                            <TableRow className={projectsClasses.tableRow} onClick={()=>handleClickProject(project._id)}>
                                                                <TableCell align="left">
                                                                    {title}
                                                                </TableCell>
                                                                <TableCell align="left">{project.department}</TableCell>
                                                                <TableCell >
                                                                    <Tooltip  title={`${getCompletionPercentage(project.details)}%`} placement="top" TransitionComponent={Zoom}>
                                                                        <LinearProgress variant='determinate' value={getCompletionPercentage(project.details)} style={{height:8,borderRadius:10}}/>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell align="left">{
                                                                    project.students.map((student,index) =>
                                                                        <div key={index} style={{display:'flex'}}>
                                                                            <Tooltip  title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                                                                <Avatar className={projectsClasses.avatar}>{student.name.charAt(0).toUpperCase()}</Avatar>
                                                                            </Tooltip>
                                                                        </div>
                                                                    )
                                                                }</TableCell>
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
        </ProjectState>
    );
};

export default withSupervisorAuthSync(Projects);