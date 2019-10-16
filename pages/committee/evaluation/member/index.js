import CommitteeMemberLayout from "../../../../components/Layouts/CommitteeMemberLayout";
import EvaluationComponent from "../../../../components/evaluation/EvaluationComponent";
import {withEvaluationMemberAuthSync} from "../../../../components/routers/evaluationMemberAuth";

const Index = () => {
    return (
        <CommitteeMemberLayout committeeType='Evaluation'>
            <EvaluationComponent/>
        </CommitteeMemberLayout>
    );
};

export default withEvaluationMemberAuthSync(Index);