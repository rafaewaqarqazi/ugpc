import {Container} from '@material-ui/core';

import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import SignInComponent from "../components/SignInComponent";
import {isAuthenticated} from "../auth";
import router from 'next/router';
const SignIn = ()  => {

    return (
        <LandingPageLayout>
            <Container component="main" maxWidth="xs">
                <SignInComponent/>
            </Container>
        </LandingPageLayout>
    );
};

 SignIn.getInitialProps = async function(){
     if (isAuthenticated() && isAuthenticated().user.role === 'Student'){
         router.push('/student-panel')
     }
     return {}
 };
export default SignIn;