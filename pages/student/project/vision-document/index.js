import StudentPanelLayout from "../../../../components/Layouts/StudentPanelLayout";
import VisionDocumentListComponent from "../../../../components/visionDocument/list/VisionDocumentListComponent";
import ProjectState from "../../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../../components/routers/studentAuth";

const VisionDocument = () => {
    return (
        <ProjectState>
        <StudentPanelLayout>
            <VisionDocumentListComponent/>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(VisionDocument);