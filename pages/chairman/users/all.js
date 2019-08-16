import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";
const All = () => {
    return (
        <ChairmanPanelLayout>

        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(All);