import SignUpComponent from "../../components/SignUpComponent";
import {withLandingAuthSync} from "../../components/routers/landingAuth";
import LandingPageLayout from "../../components/Layouts/LandingPageLayout";

const SignUp = () => {
  return (
    <LandingPageLayout>
      <SignUpComponent/>
    </LandingPageLayout>
  );
};
export default withLandingAuthSync(SignUp);