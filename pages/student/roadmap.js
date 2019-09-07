import StudentPanelLayout from "../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../context/project/ProjectState";

import {withStudentAuthSync} from '../../components/routers/studentAuth';

const Roadmap = () => {
    return (
            <ProjectState>
                <StudentPanelLayout>

                </StudentPanelLayout>
            </ProjectState>
    );
};


export default withStudentAuthSync(Roadmap);