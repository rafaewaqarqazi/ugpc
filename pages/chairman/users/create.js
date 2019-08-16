import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";

const Create = () => {
    return (
        <ChairmanPanelLayout>

        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Create);