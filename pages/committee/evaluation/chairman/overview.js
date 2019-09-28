import EvaluationChairmanLayout from "../../../../components/Layouts/EvaluationChairmanLayout";
import {withChairmanEvaluationAuthSync} from "../../../../components/routers/chairmanEvaluationAuth";

const Overview = () => {
    return (
        <EvaluationChairmanLayout>

        </EvaluationChairmanLayout>
    );
};

export default withChairmanEvaluationAuthSync(Overview);