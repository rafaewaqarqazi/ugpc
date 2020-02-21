import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";
import MeetingsWithSupervisorComponent from "../../../../components/project/meetings/MeetingsWithSupervisorComponent";
import ProjectContext from "../../../../context/project/project-context";
import CircularLoading from "../../../../components/loading/CircularLoading";
import {Container, Typography} from "@material-ui/core";
import {VisibilityOutlined} from "@material-ui/icons";
import {useListContainerStyles} from "../../../../src/material-styles/listContainerStyles";

const Meetings = () => {
  const router = useRouter();
  const {projectId} = router.query;
  const classes = useListContainerStyles();
  return (
    <ProjectState>
      <SupervisorProjectLayout projectId={projectId}>
        <ProjectContext.Consumer>
          {
            ({project}) =>
              project.isLoading ?
                <CircularLoading/>
                :
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
                    <MeetingsWithSupervisorComponent meetings={project.project.details.meetings} role='Supervisor'/>
                  </div>
                </Container>
          }
        </ProjectContext.Consumer>
      </SupervisorProjectLayout>
    </ProjectState>
  );
};

export default withSupervisorAuthSync(Meetings);