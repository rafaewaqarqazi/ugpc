import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";
import {Container, LinearProgress} from "@material-ui/core";
import ListBacklog from "../../../../components/project/backlogs/ListBacklog";
import ProjectContext from "../../../../context/project/project-context";
import BacklogAndSprintContainer from "../../../../components/project/BacklogAndSprintContainer";

const Backlog = () => {
  const router = useRouter();
  const {projectId} = router.query;
  return (
    <ProjectState>
      <SupervisorProjectLayout projectId={projectId}>
        <Container maxWidth='md' style={{padding: 0}}>
          <BacklogAndSprintContainer title='Backlog'>
            <ProjectContext.Consumer>
              {
                ({project}) =>
                  project.isLoading ?
                    <LinearProgress color='secondary'/>
                    :
                    <ListBacklog backlog={project.project.details.backlog}/>

              }
            </ProjectContext.Consumer>
          </BacklogAndSprintContainer>
        </Container>
      </SupervisorProjectLayout>
    </ProjectState>
  );
};


export default withSupervisorAuthSync(Backlog);