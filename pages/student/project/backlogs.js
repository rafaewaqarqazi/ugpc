import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import React from "react";

import ApprovalChecker from "../../../components/project/ApprovalChecker";
const Backlogs = () => {

    return (
        <ProjectState>
            <StudentPanelLayout>
                <ApprovalChecker title={'Backlogs'}>
                    <div>lkajsdlk</div>
                </ApprovalChecker>
            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Backlogs);