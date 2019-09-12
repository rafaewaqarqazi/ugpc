import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import ApprovalChecker from "../../../components/project/ApprovalChecker";
import ProjectContext from '../../../context/project/project-context';
import {Container, LinearProgress} from "@material-ui/core";
import ListBacklogs from "../../../components/project/backlogs/ListBacklogs";
import {formatBacklogs} from "../../../components/coordinator/presentations/formatData";

const Backlogs = () => {

    return (
        <ProjectState>
            <StudentPanelLayout>
                <Container>
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
                                            const backlogs = formatBacklogs(project.project[0].details.backlogs)
                                            return (
                                                <ListBacklogs backlogs={backlogs} />
                                            )
                                        }

                                    }
                                }
                            </ProjectContext.Consumer>
                    </ApprovalChecker>
                </Container>
            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Backlogs);