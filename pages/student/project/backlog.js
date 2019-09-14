import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import ApprovalChecker from "../../../components/project/ApprovalChecker";
import ProjectContext from '../../../context/project/project-context';
import { LinearProgress} from "@material-ui/core";
import ListBacklog from "../../../components/project/backlogs/ListBacklog";


const Backlog = () => {

    return (
        <ProjectState>
            <StudentPanelLayout>

                    <ApprovalChecker title={'Backlogs'}>
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
                                                <ListBacklog backlog={project.project[0].details.backlog} />
                                            )
                                        }

                                    }
                                }
                            </ProjectContext.Consumer>
                    </ApprovalChecker>

            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Backlog);