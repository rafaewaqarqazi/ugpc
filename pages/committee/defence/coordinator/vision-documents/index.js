import VisionDocsState from "../../../../../context/visionDocs/VisionDocsState";
import CoordinatorLayout from "../../../../../components/Layouts/CoordinatorLayout";
import DocsListComponent from "../../../../../components/visionDocument/higherAuthority/list/DocsListComponent";
import {withCoordinatorAuthSync} from "../../../../../components/routers/coordinatorAuth";

const Index = () => {
  return (
    <VisionDocsState>
      <CoordinatorLayout>
        <DocsListComponent/>
      </CoordinatorLayout>
    </VisionDocsState>
  );
};

export default withCoordinatorAuthSync(Index);