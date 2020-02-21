import EvaluationChairmanLayout from "../../../../components/Layouts/EvaluationChairmanLayout";
import ProfileComponent from "../../../../components/profile/ProfileComponent";
import {withChairmanEvaluationAuthSync} from "../../../../components/routers/chairmanEvaluationAuth";

const Profile = () => {
  return (
    <EvaluationChairmanLayout>
      <ProfileComponent/>
    </EvaluationChairmanLayout>
  );
};

export default withChairmanEvaluationAuthSync(Profile);