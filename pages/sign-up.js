import {Container} from '@material-ui/core';
import SignUpComponent from "../components/SignUpComponent";
import LandingRouter from "../components/routers/LandingRouter";

const SignUp =()=> {
    return (
        <LandingRouter>
            <Container component="main" maxWidth="xs">
                <SignUpComponent />
            </Container>
        </LandingRouter>
    );
};
export default SignUp