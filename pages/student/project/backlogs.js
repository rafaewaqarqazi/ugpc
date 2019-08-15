import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";

const Backlogs = () => {
    return (
        <ProjectState>
        <StudentPanelLayout>
            Backlogs
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Backlogs);