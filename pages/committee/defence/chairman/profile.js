import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import {withChairmanDefenceAuthSync} from "../../../../components/routers/chairmanDefenceAuth";
import ProfileComponent from "../../../../components/profile/ProfileComponent";

const Profile = () => {
  return (
    <CommitteeMemberLayout committeeType='Defence' position='Chairman_Committee'>
      <ProfileComponent/>
    </CommitteeMemberLayout>
  );
};

export default withChairmanDefenceAuthSync(Profile);