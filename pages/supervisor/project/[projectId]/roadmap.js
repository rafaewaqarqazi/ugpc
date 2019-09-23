import React from 'react';
import SupervisorProjectLayout from "../../../../components/Layouts/SupervisorProjectLayout";
import {withSupervisorAuthSync} from "../../../../components/routers/supervisorAuth";

import ProjectState from "../../../../context/project/ProjectState";
import ProjectRoadMap from "../../../../components/project/ProjectRoadMap";
import {useRouter} from "next/router";

const Roadmap = () => {
    const router = useRouter();
    const {projectId} = router.query;
    return (
        <ProjectState>
            <SupervisorProjectLayout projectId={projectId}>
                <ProjectRoadMap/>
            </SupervisorProjectLayout>
        </ProjectState>
    );
};

export default withSupervisorAuthSync(Roadmap);