import {withChairmanAuthSync} from "../../../components/routers/chairmanAuth";
import ChairmanPanelLayout from "../../../components/Layouts/ChairmanPanelLayout";
import UsersMainComponent from "../../../components/chairman/users/UsersMainComponent";
import {useContext, useEffect} from "react";
import UserContext from '../../../context/user/user-context';
const Index = () => {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchAllUsers();
    },[])
    return (
        <ChairmanPanelLayout>
            <UsersMainComponent/>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Index);