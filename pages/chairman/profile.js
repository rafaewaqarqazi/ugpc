import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import ProfileComponent from "../../components/profile/ProfileComponent";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";

const Profile = () => {
  return (
    <ChairmanPanelLayout>
      <ProfileComponent/>
    </ChairmanPanelLayout>
  );
};

export default withChairmanAuthSync(Profile);