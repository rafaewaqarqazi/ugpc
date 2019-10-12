import CoordinatorLayout from "../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../components/routers/coordinatorAuth";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../../../context/user/user-context";
import CoordinatorSupervisorsComponent from "../../../../components/coordinator/CoodinatorSupervisorsComponent";
import {fetchAllSupervisorsAPI} from "../../../../utils/apiCalls/users";
const Supervisors = () => {
    const [supervisors,setSupervisors] = useState({
        isLoading:true,
        supervisors:[]
    });

    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchAllUsers();
        fetchAllSupervisorsAPI()
            .then(result =>{
                setSupervisors({
                    isLoading: false,
                    supervisors:result
                })
            });
    },[]);
    return (
        <CoordinatorLayout>
            <CoordinatorSupervisorsComponent supervisors={supervisors}/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Supervisors);