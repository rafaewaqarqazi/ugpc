import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from '../../../components/routers/studentAuth';
import ApprovalChecker from "../../../components/project/ApprovalChecker";
import {LinearProgress} from "@material-ui/core";
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
                                    const sprintNames = project.project[0].details.sprint.map(sprint => sprint.name)
                                    return (
                                        <RenderScrumBoard sprint={project.project[0].details.sprint} sprintNames={sprintNames}/>
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