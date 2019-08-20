import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import TitleComponent from "../../../components/title/TitleComponent";

const Index = () => {
    return (
        <CoordinatorLayout>
            <TitleComponent title='Projects'/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Index);