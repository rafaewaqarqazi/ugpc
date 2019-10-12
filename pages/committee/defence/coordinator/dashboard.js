import CoordinatorLayout from "../../../../components/Layouts/CoordinatorLayout";
import {withCoordinatorAuthSync} from "../../../../components/routers/coordinatorAuth";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../../../context/user/user-context";
import {fetchAllProjectsAPI} from "../../../../utils/apiCalls/projects";
import CoordinatorDashboard from "../../../../components/coordinator/dashboard/CoordinatorDashboard";
import {fetchAllStudentsAPI, fetchVisionDocsDataForDashboardAPI} from "../../../../utils/apiCalls/users";
import {fetchVisionDocsPieDataAPI} from "../../../../utils/apiCalls/visionDocs";
const Dashboard = () => {
    const [projects,setProjects] = useState({
        isLoading:true,
        projects:[]
    });
    const [students,setStudents] = useState({
        isLoading:true,
        students:[]
    });
    const [visionDocs,setVisionDocs] = useState({
        isLoading:true,
        visionDocs:[]
    });
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchAllUsers();
        fetchAllProjectsAPI()
            .then(result =>{
                setProjects({
                    isLoading: false,
                    projects:result
                })
            });
        fetchAllStudentsAPI()
            .then(result =>{
                setStudents({
                    isLoading: false,
                    students:result
                })
            });
        fetchVisionDocsPieDataAPI()
            .then(result =>{
                setVisionDocs({
                    isLoading: false,
                    visionDocs:result
                })
            })
    },[]);
    return (
        <CoordinatorLayout>
            <CoordinatorDashboard projects={projects} students={students} visionDocs={visionDocs}/>
        </CoordinatorLayout>
    );
};

export default withCoordinatorAuthSync(Dashboard);