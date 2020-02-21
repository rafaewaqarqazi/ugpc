import React from "react";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import SupervisorProjectsComponent from "../../components/project/SupervisorProjectsComponent";


const SupervisorProjects = () => {
  return (
    <SupervisorLayout>
      <SupervisorProjectsComponent/>
    </SupervisorLayout>
  );
};

export default withSupervisorAuthSync(SupervisorProjects);