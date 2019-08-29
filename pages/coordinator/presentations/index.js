import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import PresentationComponent from "../../../components/coordinator/presentations/PresentationComponent";

const Index = () => {
    return (
        <VisionDocsState>
            <CoordinatorLayout>
                <PresentationComponent />
            </CoordinatorLayout>
        </VisionDocsState>
    );
};


export default withCoordinatorAuthSync(Index);