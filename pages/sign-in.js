import SignInComponent from "../components/SignInComponent";
import LandingRouter from "../components/routers/LandingRouter";

const SignIn = ()  => {

    return (
        <LandingRouter>
            <SignInComponent/>
        </LandingRouter>
    );
};


export default SignIn;