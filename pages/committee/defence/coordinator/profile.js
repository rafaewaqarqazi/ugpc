import CoordinatorLayout from "../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../components/routers/coordinatorAuth";
import ProfileComponent from "../../../../components/profile/ProfileComponent";

const Profile = () => {
    return (
        <CoordinatorLayout>
            <ProfileComponent/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Profile);