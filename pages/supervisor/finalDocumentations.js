import React from 'react';
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";

const FinalDocumentations = () => {
    return (
        <SupervisorLayout>

        </SupervisorLayout>
    );
};

export default withSupervisorAuthSync(FinalDocumentations);