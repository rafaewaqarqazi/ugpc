import React from 'react';
import ProgramOfficeLayout from "../../components/Layouts/ProgramOfficeLayout";
import ProfileComponent from "../../components/profile/ProfileComponent";
import {withProgramOfficeAuthSync} from "../../components/routers/programOfficeAuth";

const Profile = () => {
    return (
        <ProgramOfficeLayout>
            <ProfileComponent/>
        </ProgramOfficeLayout>
    );
};

export default withProgramOfficeAuthSync(Profile);