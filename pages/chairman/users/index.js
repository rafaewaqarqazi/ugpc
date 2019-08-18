import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";

import TitleComponent from "../../../components/title/TitleComponent";
const Index = () => {
    return (
        <ChairmanPanelLayout>
            <TitleComponent title='Users'/>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Index);