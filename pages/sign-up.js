import {Container} from '@material-ui/core';
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import SignUpComponent from "../components/SignUpComponent";

export default function SignUp() {
    return (
        <LandingPageLayout>
            <Container component="main" maxWidth="xs">
                <SignUpComponent/>
            </Container>
        </LandingPageLayout>
    );
}