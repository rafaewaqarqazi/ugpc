import EvaluationChairmanLayout from "../../../../components/Layouts/EvaluationChairmanLayout";
import {withChairmanEvaluationAuthSync} from "../../../../components/routers/chairmanEvaluationAuth";

import EvaluationComponent from "../../../../components/evaluation/EvaluationComponent";


const Projects = () => {

    return (
        <EvaluationChairmanLayout>
            <EvaluationComponent/>
        </EvaluationChairmanLayout>
    );
};

export default withChairmanEvaluationAuthSync(Projects);