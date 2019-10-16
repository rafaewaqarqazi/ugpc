import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import {withEvaluationMemberAuthSync} from "../../../../components/routers/evaluationMemberAuth";
import ProfileComponent from "../../../../components/profile/ProfileComponent";

const Profile = () => {
    return (
        <CommitteeMemberLayout committeeType='Evaluation'>
           <ProfileComponent/>
        </CommitteeMemberLayout>
    );
};

export default withEvaluationMemberAuthSync(Profile);