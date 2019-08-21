import StudentPanelLayout from "../../../../components/Layouts/StudentPanelLayout";
import VisionDocumentListComponent from "../../../../components/visionDocument/list/VisionDocumentListComponent";
import ProjectState from "../../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../../components/routers/studentAuth";
import VisionDocsState from "../../../../context/visionDocs/VisionDocsState";

const VisionDocument = () => {
    return (
        <ProjectState>
            <VisionDocsState>
                <StudentPanelLayout>
                    <VisionDocumentListComponent/>
                </StudentPanelLayout>
            </VisionDocsState>
        </ProjectState>
    );
};

export default withStudentAuthSync(VisionDocument);