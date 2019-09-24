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
                <BacklogAndSprintContainer title='Backlog'>
                    <ProjectContext.Consumer>
                        {
                            ({project})=>{
                                if (project.isLoading){
                                    return (
                                        <LinearProgress color='secondary'/>
                                    )
                                }
                                if (!project.isLoading){
                                    return (
                                        <ListBacklog backlog={project.project.details.backlog} />
                                    )
                                }

                            }
                        }
                    </ProjectContext.Consumer>
                </BacklogAndSprintContainer>
            </SupervisorProjectLayout>
        </ProjectState>
    );
};


export default withSupervisorAuthSync(Backlog);