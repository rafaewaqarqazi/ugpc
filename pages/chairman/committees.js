import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";
import CommitteesComponent from "../../components/chairman/committees/CommitteesComponent";
import {useContext, useEffect} from "react";
import UserContext from "../../context/user/user-context";

const Committees = () => {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchCommittees();
    },[])
    return (
        <ChairmanPanelLayout>
            <CommitteesComponent/>
        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Committees);