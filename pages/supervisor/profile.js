import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import ProfileComponent from "../../components/profile/ProfileComponent";

const Profile = () => {
    return (
        <SupervisorLayout>
            <ProfileComponent/>
        </SupervisorLayout>
    );
};

export default withSupervisorAuthSync(Profile);