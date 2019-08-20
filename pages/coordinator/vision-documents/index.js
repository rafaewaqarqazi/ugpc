import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import TitleComponent from "../../../components/title/TitleComponent";
import UserState from "../../../context/user/UserState";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import DocsListComponent from "../../../components/visionDocument/higherAuthority/list/DocsListComponent";
const Index = () => {
    return (
        <UserState>
            <VisionDocsState>
                <CoordinatorLayout>
                    <TitleComponent title='Vision Documents'/>
                    <DocsListComponent />
                </CoordinatorLayout>
            </VisionDocsState>
        </UserState>
    );
};

export default withCoordinatorAuthSync(Index);