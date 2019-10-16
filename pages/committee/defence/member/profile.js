import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import ProfileComponent from "../../../../components/profile/ProfileComponent";
import {withDefenceMemberAuthSync} from "../../../../components/routers/defenceMemberAuth";

const Profile = () => {
    return (
        <CommitteeMemberLayout committeeType='Defence'>
            <ProfileComponent/>
        </CommitteeMemberLayout>
    );
};

export default withDefenceMemberAuthSync(Profile);