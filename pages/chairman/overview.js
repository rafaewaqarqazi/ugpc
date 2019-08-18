import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";
import TitleComponent from "../../components/title/TitleComponent";

const Overview = () => {
    return (
        <ChairmanPanelLayout>
            <TitleComponent title='Overview'/>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Overview);