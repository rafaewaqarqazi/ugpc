import StudentPanelLayout from "../../../../components/Layouts/StudentPanelLayout";
import StudentVisionDocumentListComponent from "../../../../components/visionDocument/list/StudentVisionDocumentListComponent";
import ProjectState from "../../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../../components/routers/studentAuth";
import VisionDocsState from "../../../../context/visionDocs/VisionDocsState";

const VisionDocument = () => {
    return (
        <ProjectState>
            <VisionDocsState>
                <StudentPanelLayout>
                    <StudentVisionDocumentListComponent/>
                </StudentPanelLayout>
            </VisionDocsState>
        </ProjectState>
    );
};

export default withStudentAuthSync(VisionDocument);