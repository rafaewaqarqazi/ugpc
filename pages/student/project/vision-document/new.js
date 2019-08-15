
import StudentPanelLayout from "../../../../components/Layouts/StudentPanelLayout";
import VisionDocumentUploadComponent from "../../../../components/visionDocument/upload/VisionDocumentUploadComponent";
import ProjectState from "../../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../../components/routers/studentAuth";

const VisionDocument = () => {
    return (
        <ProjectState>
        <StudentPanelLayout>
            <VisionDocumentUploadComponent/>
        </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(VisionDocument);