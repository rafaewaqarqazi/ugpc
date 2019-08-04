import {Container} from '@material-ui/core';

import SignInComponent from "../components/SignInComponent";
import LandingRouter from "../components/routers/LandingRouter";

const SignIn = ()  => {

    return (
        <LandingRouter>
            <Container component="main" maxWidth="xs">
                <SignInComponent/>
            </Container>
        </LandingRouter>
    );
};


export default SignIn;