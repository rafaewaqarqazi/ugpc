import React from 'react';
import CommitteeMemberLayout from "../../../components/Layouts/CommitteeMemberLayout";
import {withDefenceMemberAuthSync} from "../../../components/routers/defenceMemberAuth";

const Member = () => {
    return (
        <CommitteeMemberLayout>

        </CommitteeMemberLayout>
    );
};

export default  withDefenceMemberAuthSync(Member);