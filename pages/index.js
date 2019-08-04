import LandingRouter from "../components/routers/LandingRouter";
import {Container} from '@material-ui/core';


const Index = () => {

    return (
        <LandingRouter>
            <Container>
                <h3>Welcome To UGPC</h3>
            </Container>
        </LandingRouter>
    );
};


export default Index;