import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";
import MeetingsWithSupervisorComponent from "../../../../components/project/meetings/MeetingsWithSupervisorComponent";
import ProjectContext from "../../../../context/project/project-context";
import CircularLoading from "../../../../components/loading/CircularLoading";

const Meetings = () => {
    const router = useRouter();
    const {projectId} = router.query;

    return (
        <ProjectState>
            <SupervisorProjectLayout projectId={projectId}>
                <ProjectContext.Consumer>
                    {
                        ({project})=>
                            project.isLoading ?
                                <CircularLoading />
                                :
                                <MeetingsWithSupervisorComponent meetings={project.project.details.meetings} role='Supervisor'/>
                    }
                </ProjectContext.Consumer>
            </SupervisorProjectLayout>
        </ProjectState>
    );
};

export default withSupervisorAuthSync(Meetings);