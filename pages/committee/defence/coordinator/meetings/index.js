import VisionDocsState from "../../../../../context/visionDocs/VisionDocsState";
import CoordinatorLayout from "../../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../../components/routers/coordinatorAuth";
import DefenceMeetingComponent from "../../../../../components/coordinator/DefenceMeetingComponent";

const Index = () => {

  return (
    <VisionDocsState>
      <CoordinatorLayout>
        <DefenceMeetingComponent/>
      </CoordinatorLayout>
    </VisionDocsState>
  );
};


export default withCoordinatorAuthSync(Index);