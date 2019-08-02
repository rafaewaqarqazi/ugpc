import {Container} from '@material-ui/core';

import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import SignInComponent from "../components/SignInComponent";


 const SignIn = ()  => {

    return (
        <LandingPageLayout>
            <Container component="main" maxWidth="xs">
                <SignInComponent/>
            </Container>
        </LandingPageLayout>
    );
};
export default SignIn;