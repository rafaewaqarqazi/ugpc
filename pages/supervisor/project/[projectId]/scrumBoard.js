import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";
import {useRouter} from "next/router";
import ProjectState from "../../../../context/project/ProjectState";

const ScrumBoard = () => {
    const router = useRouter();
    const {projectId} = router.query;
    return (
        <ProjectState>
            <SupervisorProjectLayout projectId={projectId}>

            </SupervisorProjectLayout>
        </ProjectState>
    );
};

export default withSupervisorAuthSync(ScrumBoard);