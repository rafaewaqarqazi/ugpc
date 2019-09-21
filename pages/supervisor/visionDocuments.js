import React from 'react';
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import VisionDocsState from "../../context/visionDocs/VisionDocsState";
import SupervisorVisionDocs from "../../components/visionDocument/SupervisorVisionDocs";

const VisionDocuments = () => {
    return (
        <VisionDocsState>
            <SupervisorLayout>
                <SupervisorVisionDocs/>
            </SupervisorLayout>
        </VisionDocsState>
    );
};

export default withSupervisorAuthSync(VisionDocuments);