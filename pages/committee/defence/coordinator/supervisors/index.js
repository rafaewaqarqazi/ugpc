import CoordinatorLayout from "../../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../../components/routers/coordinatorAuth";
import TitleComponent from "../../../../../components/title/TitleComponent";


const Index = () => {
    return (
        <CoordinatorLayout>
            <TitleComponent title='Supervisors'/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Index);