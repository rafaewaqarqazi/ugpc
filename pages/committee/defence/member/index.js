import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import DefenceMeetingComponent from "../../../../components/coordinator/DefenceMeetingComponent";
import {withDefenceMemberAuthSync} from "../../../../components/routers/defenceMemberAuth";
import VisionDocsState from "../../../../context/visionDocs/VisionDocsState";

const Index = () => {
  return (
    <VisionDocsState>
      <CommitteeMemberLayout committeeType='Defence' position='Member'>
        <DefenceMeetingComponent/>
      </CommitteeMemberLayout>
    </VisionDocsState>
  );
};

export default withDefenceMemberAuthSync(Index);