import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import DefenceMeetingComponent from "../../../../components/coordinator/DefenceMeetingComponent";
import {withDefenceMemberAuthSync} from "../../../../components/routers/defenceMemberAuth";

const Index = () => {
    return (
        <CommitteeMemberLayout committeeType='Defence'>
            <DefenceMeetingComponent/>
        </CommitteeMemberLayout>
    );
};

export default withDefenceMemberAuthSync(Index);