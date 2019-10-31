import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import DefenceMeetingComponent from "../../../../components/coordinator/DefenceMeetingComponent";
import {withChairmanDefenceAuthSync} from "../../../../components/routers/chairmanDefenceAuth";

const Index = () => {
    return (
        <CommitteeMemberLayout committeeType='Defence' position='Chairman_Committee'>
            <DefenceMeetingComponent/>
        </CommitteeMemberLayout>
    );
};

export default withChairmanDefenceAuthSync(Index);