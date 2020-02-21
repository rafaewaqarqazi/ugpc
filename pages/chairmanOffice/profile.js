import ChairmanOfficeLayout from "../../components/Layouts/chairmanOfficeLayout";
import {withChairmanOfficeAuthSync} from "../../components/routers/chairmanOfficeAuth";
import ProfileComponent from "../../components/profile/ProfileComponent";

const Profile = () => {
  return (
    <ChairmanOfficeLayout>
      <ProfileComponent/>
    </ChairmanOfficeLayout>
  );
};

export default withChairmanOfficeAuthSync(Profile);