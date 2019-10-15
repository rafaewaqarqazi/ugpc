import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import CreateProject from "../../../components/project/CreateProject";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import ProjectContext from '../../../context/project/project-context';
import {Avatar, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import React from "react";
import {usePendingStyles} from "../../../src/material-styles/pending-page";
import Link from 'next/link';
const Create = () => {
    const classes = usePendingStyles();
    return (
        <ProjectState>
        <StudentPanelLayout>
            <ProjectContext.Consumer>
                {
                    ({project}) =>
                        project.isLoading ? <LinearProgress/> :
                        project.project ?
                            <Container maxWidth='xs'>
                                <div className={classes.paper}>
                                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                                    <Typography paragraph className={classes.message} color='textSecondary'>
                                        Dear Student You Already have created a Project
                                    </Typography>
                                    <Link href={'/student/roadmap'}>
                                        <Button variant='contained' color='primary' >
                                            Back to Project
                                        </Button>
                                    </Link>
                                </div>
                            </Container>:
                        <CreateProject/>
                }

            </ProjectContext.Consumer>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Create);