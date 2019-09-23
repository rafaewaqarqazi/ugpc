import StudentPanelLayout from "../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../context/project/ProjectState";

import {withStudentAuthSync} from '../../components/routers/studentAuth';
import ProjectRoadMap from "../../components/project/ProjectRoadMap";

const Roadmap = () => {
    return (
            <ProjectState>
                <StudentPanelLayout>
                    <ProjectRoadMap/>
                </StudentPanelLayout>
            </ProjectState>
    );
};


export default withStudentAuthSync(Roadmap);