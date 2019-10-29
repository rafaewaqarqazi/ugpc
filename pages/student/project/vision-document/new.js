import StudentPanelLayout from "../../../../components/Layouts/StudentPanelLayout";
import VisionDocumentUploadComponent from "../../../../components/visionDocument/upload/VisionDocumentUploadComponent";
import ProjectState from "../../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../../components/routers/studentAuth";
import {Avatar, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import Link from "next/link";
import ProjectContext from "../../../../context/project/project-context";
import React from "react";
import {usePendingStyles} from "../../../../src/material-styles/pending-page";

const VisionDocument = () => {
    const classes = usePendingStyles();
    return (
        <ProjectState>
        <StudentPanelLayout>
            <ProjectContext.Consumer>
                {
                    ({project}) =>
                        project.isLoading ? <LinearProgress/> :
                            project.project && (project.project.documentation.visionDocument.length > 0 && project.project.documentation.visionDocument.filter(doc => doc.status === 'Rejected').length === 0)?
                                <Container maxWidth='xs'>
                                    <div className={classes.paper}>
                                        <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                                        <Typography paragraph className={classes.message} color='textSecondary'>
                                            Dear Student You Already have submitted a Vision Document
                                        </Typography>
                                        <Link href={'/student/roadmap'}>
                                            <Button variant='contained' color='primary' >
                                                Back to Project
                                            </Button>
                                        </Link>
                                    </div>
                                </Container>
                                :
                                <VisionDocumentUploadComponent/>
                }

            </ProjectContext.Consumer>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(VisionDocument);