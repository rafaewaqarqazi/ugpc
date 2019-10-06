
import StudentPanelLayout from "../../components/Layouts/StudentPanelLayout";
import ProfileComponent from "../../components/profile/ProfileComponent";
import {withStudentAuthSync} from "../../components/routers/studentAuth";
import ProjectState from "../../context/project/ProjectState";

const Profile = () => {
    return (
        <ProjectState>
        <StudentPanelLayout>
            <ProfileComponent/>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Profile);