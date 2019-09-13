import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from '../../../components/routers/studentAuth';
import ApprovalChecker from "../../../components/project/ApprovalChecker";
import {LinearProgress} from "@material-ui/core";
import {formatBacklogs, formatScrumBoard} from "../../../components/coordinator/presentations/formatData";
import ListBacklog from "../../../components/project/backlogs/ListBacklog";
import ProjectContext from "../../../context/project/project-context";
import RenderScrumBoard from "../../../components/project/scrumBoard/RenderScrumBoard";

const ScrumBoard = () => {
    return (
        <ProjectState>
            <StudentPanelLayout>
                <ApprovalChecker title={'Scrum Board'}>
                    <ProjectContext.Consumer>
                        {
                            ({project})=>{
                                if (project.isLoading){
                                    return (
                                        <LinearProgress color='secondary'/>
                                    )
                                }
                                if (!project.isLoading){
                                    const sprint = formatScrumBoard(project.project[0].details.sprints)
                                    return (
                                        <RenderScrumBoard sprint={sprint} />
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


export default withStudentAuthSync(ScrumBoard);