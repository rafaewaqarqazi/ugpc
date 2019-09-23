import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";
import {LinearProgress} from "@material-ui/core";
import RenderScrumBoard from "../../../../components/project/scrumBoard/RenderScrumBoard";
import ProjectContext from "../../../../context/project/project-context";
import BacklogAndSprintContainer from "../../../../components/project/BacklogAndSprintContainer";

const ScrumBoard = () => {
    const router = useRouter();
    const {projectId} = router.query;
    return (
        <ProjectState>
            <SupervisorProjectLayout projectId={projectId}>
                <BacklogAndSprintContainer title='Scrum Board'>
                    <ProjectContext.Consumer>
                        {
                            ({project})=>{
                                if (project.isLoading){
                                    return (
                                        <LinearProgress color='secondary'/>
                                    )
                                }
                                if (!project.isLoading){
                                    const sprintNames = project.project.details.sprint.map(sprint =>{
                                        if (sprint.status === 'InComplete'){
                                            return sprint.name
                                        }else return
                                    })
                                    console.log(sprintNames)
                                    return (
                                        <RenderScrumBoard sprint={project.project.details.sprint} sprintNames={sprintNames.filter(name => name !== undefined)}/>
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

export default withSupervisorAuthSync(ScrumBoard);