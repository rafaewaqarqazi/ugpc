import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from '../../../components/routers/studentAuth';
import ApprovalChecker from "../../../components/project/ApprovalChecker";

const ScrumBoard = () => {
    return (
        <ProjectState>
            <StudentPanelLayout>
                <ApprovalChecker title={'Scrum Board'}>

                </ApprovalChecker>
            </StudentPanelLayout>
        </ProjectState>
    );
};


export default withStudentAuthSync(ScrumBoard);