import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import CreateProject from "../../../components/project/CreateProject";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";

const Create = () => {
    return (
        <ProjectState>
        <StudentPanelLayout>
            <CreateProject/>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Create);