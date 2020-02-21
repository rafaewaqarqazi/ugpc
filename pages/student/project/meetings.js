import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import CircularLoading from "../../../components/loading/CircularLoading";
import MeetingsWithSupervisorComponent from "../../../components/project/meetings/MeetingsWithSupervisorComponent";
import ProjectContext from "../../../context/project/project-context";
import ProjectState from "../../../context/project/ProjectState";
import {Container, Typography} from "@material-ui/core";
import {VisibilityOutlined} from "@material-ui/icons";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import React from "react";
import StudentDefenceMeetingComponent from "../../../components/project/meetings/StudentDefenceMeetingComponent";
import StudentEvaluationMeetingsComponent
  from "../../../components/project/meetings/StudentEvaluationMeetingsComponent";

const Meetings = () => {
  const classes = useListContainerStyles();
  return (
    <ProjectState>
      <StudentPanelLayout>
        <ProjectContext.Consumer>
          {
            ({project}) =>
              project.isLoading ?
                <CircularLoading/>
                :
                <div>
                  <Container>
                    <div className={classes.listContainer}>
                      <div className={classes.top}>
                        <div className={classes.topIconBox}>
                          <VisibilityOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle}>
                          <Typography variant='h5'>Meetings</Typography>
                        </div>
                      </div>
                      <Typography variant='h6' color='textPrimary' className={classes.marginTop}>Defence</Typography>
                      <StudentDefenceMeetingComponent docs={project.project.documentation.visionDocument}/>
                      <Typography variant='h6' color='textPrimary' className={classes.marginTop}>Evaluation</Typography>
                      <StudentEvaluationMeetingsComponent internal={project.project.details.internal}
                                                          external={project.project.details.external}/>
                      <Typography variant='h6' color='textPrimary' className={classes.marginTop}>Supervisor</Typography>
                      <MeetingsWithSupervisorComponent meetings={project.project.details.meetings}/>
                    </div>
                  </Container>
                </div>

          }
        </ProjectContext.Consumer>
      </StudentPanelLayout>
    </ProjectState>
  );
};

export default withStudentAuthSync(Meetings);