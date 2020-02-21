import VisionDocsState from "../../../../../context/visionDocs/VisionDocsState";
import CoordinatorLayout from "../../../../../components/Layouts/CoordinatorLayout";
import PresentationComponent from "../../../../../components/coordinator/presentations/PresentationComponent";
import {withCoordinatorAuthSync} from "../../../../../components/routers/coordinatorAuth";


const Index = () => {
  return (
    <VisionDocsState>
      <CoordinatorLayout>
        <PresentationComponent/>
      </CoordinatorLayout>
    </VisionDocsState>
  );
};


export default withCoordinatorAuthSync(Index);