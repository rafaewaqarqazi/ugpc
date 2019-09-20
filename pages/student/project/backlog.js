import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import ProjectContext from '../../../context/project/project-context';
import { LinearProgress} from "@material-ui/core";
import ListBacklog from "../../../components/project/backlogs/ListBacklog";
import BacklogAndSprintContainer from "../../../components/project/BacklogAndSprintContainer";


const Backlog = () => {

    return (
        <ProjectState>
            <StudentPanelLayout>

                    <BacklogAndSprintContainer title={'Backlog'}>
                            <ProjectContext.Consumer>
                                {
                                    ({project})=>{
                                        if (project.isLoading){
                                            return (
                                                <LinearProgress color='secondary'/>
                                            )
                                        }
                                        if (!project.isLoading){
                                            return (
                                                <ListBacklog backlog={project.project.details.backlog} />
                                            )
                                        }

                                    }
                                }
                            </ProjectContext.Consumer>
                    </BacklogAndSprintContainer>

            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Backlog);