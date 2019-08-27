import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import PresentationComponent from "../../../components/presentations/PresentationComponent";

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