import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";
import TitleComponent from "../../../components/title/TitleComponent";
import NewUserComponent from "../../../components/chairman/add/NewUserComponent";
const User = () => {
    return (
        <ChairmanPanelLayout>
           <TitleComponent title='New User'/>
           <NewUserComponent />
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(User);