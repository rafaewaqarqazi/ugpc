import {Container} from '@material-ui/core';
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {withLandingAuthSync} from "../components/routers/landingAuth";

const Index = () => {

    return (
        <LandingPageLayout>
            <Container>
                <h3>Welcome To UGPC</h3>
            </Container>
        </LandingPageLayout>
    );
};


export default withLandingAuthSync(Index);