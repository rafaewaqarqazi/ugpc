import CoordinatorLayout from "../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../components/routers/coordinatorAuth";
import TitleComponent from "../../../../components/title/TitleComponent";

const Overview = () => {
    return (
        <CoordinatorLayout>
            <TitleComponent title='Overview'/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Overview);