import React from 'react';
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";

const VisionDocuments = () => {
    return (
        <SupervisorLayout>
            
        </SupervisorLayout>
    );
};

export default withSupervisorAuthSync(VisionDocuments);