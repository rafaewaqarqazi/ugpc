import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";

const Overview = () => {
    return (
        <ChairmanPanelLayout>
            <div>Chairman Overview</div>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Overview);