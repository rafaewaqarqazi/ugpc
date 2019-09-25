import CoordinatorLayout from "../../../../../components/Layouts/CoordinatorLayout";
import TitleComponent from "../../../../../components/title/TitleComponent";
import {withCoordinatorAuthSync} from "../../../../../components/routers/coordinatorAuth";

const Index = () => {
    return (
        <CoordinatorLayout>
            <TitleComponent title='Projects'/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Index);