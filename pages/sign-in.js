import SignInComponent from "../components/SignInComponent";
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {withLandingAuthSync} from "../components/routers/landingAuth";

const SignIn = () => {

  return (
    <LandingPageLayout>
      <SignInComponent/>
    </LandingPageLayout>
  );
};


export default withLandingAuthSync(SignIn);