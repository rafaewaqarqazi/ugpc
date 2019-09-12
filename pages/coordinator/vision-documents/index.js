import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import DocsListComponent from "../../../components/visionDocument/higherAuthority/list/DocsListComponent";
const Index = () => {
    return (
        <VisionDocsState>
            <CoordinatorLayout>
                <DocsListComponent />
            </CoordinatorLayout>
        </VisionDocsState>
    );
};

export default withCoordinatorAuthSync(Index);