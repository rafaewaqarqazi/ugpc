import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import ProjectState from "../../../context/project/ProjectState";
import ShowProgress from "../../../components/project/ShowProgress";

const Progress = () => {
    return (
        <ProjectState>
            <StudentPanelLayout>
                <ShowProgress/>
            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Progress);