import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../context/user/user-context";
import DashboardComponent from "../../components/chairman/dashboard/DashboardComponent";
import {fetchAllProjectsAPI} from "../../utils/apiCalls/projects";

const Dashboard = () => {
  const [projects, setProjects] = useState({
    isLoading: true,
    projects: []
  });
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.fetchAllUsers();
    fetchAllProjectsAPI()
      .then(result => {
        setProjects({
          isLoading: false,
          projects: result
        })
      })
  }, []);
  return (
    <ChairmanPanelLayout>
      <DashboardComponent projects={projects}/>
    </ChairmanPanelLayout>
  );
};

export default withChairmanAuthSync(Dashboard);