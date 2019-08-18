import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";

import TitleComponent from "../../../components/title/TitleComponent";
const Committee = () => {
    return (
        <ChairmanPanelLayout>
            <TitleComponent title='New Committee'/>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Committee);