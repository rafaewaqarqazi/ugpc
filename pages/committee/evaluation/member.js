import React from 'react';
import CommitteeMemberLayout from "../../../components/Layouts/CommitteeMemberLayout";
import EvaluationComponent from "../../../components/evaluation/EvaluationComponent";
import {withEvaluationMemberAuthSync} from "../../../components/routers/evaluationMemberAuth";

const Member = () => {
    return (
        <CommitteeMemberLayout>
            <EvaluationComponent/>
        </CommitteeMemberLayout>
    );
};

export default withEvaluationMemberAuthSync(Member);