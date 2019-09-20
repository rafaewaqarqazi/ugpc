import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import ProjectState from "../../context/project/ProjectState";
const Dashboard = () => {
    return (
        <ProjectState>
            <SupervisorLayout>

            </SupervisorLayout>
        </ProjectState>
    );
};

export default withSupervisorAuthSync(Dashboard);