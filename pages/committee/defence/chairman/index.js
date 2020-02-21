import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import DefenceMeetingComponent from "../../../../components/coordinator/DefenceMeetingComponent";
import {withChairmanDefenceAuthSync} from "../../../../components/routers/chairmanDefenceAuth";
import VisionDocsState from "../../../../context/visionDocs/VisionDocsState";

const Index = () => {
  return (
    <CommitteeMemberLayout committeeType='Defence' position='Chairman_Committee'>
      <VisionDocsState>
        <DefenceMeetingComponent/>
      </VisionDocsState>
    </CommitteeMemberLayout>
  );
};

export default withChairmanDefenceAuthSync(Index);