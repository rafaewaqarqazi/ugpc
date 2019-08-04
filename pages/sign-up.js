import {Container} from '@material-ui/core';
import SignUpComponent from "../components/SignUpComponent";
import LandingRouter from "../components/routers/LandingRouter";

export default function SignUp() {
    return (
        <LandingRouter>
            <Container component="main" maxWidth="xs">
                <SignUpComponent/>
            </Container>
        </LandingRouter>
    );
}