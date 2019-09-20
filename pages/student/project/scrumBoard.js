import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from '../../../components/routers/studentAuth';

import {LinearProgress} from "@material-ui/core";
import ProjectContext from "../../../context/project/project-context";
import RenderScrumBoard from "../../../components/project/scrumBoard/RenderScrumBoard";
import BacklogAndSprintContainer from "../../../components/project/BacklogAndSprintContainer";


const ScrumBoard = () => {
    return (
        <ProjectState>
            <StudentPanelLayout>
                <BacklogAndSprintContainer title={'Scrum Board'}>
                    <ProjectContext.Consumer>
                        {
                            ({project})=>{
                                if (project.isLoading){
                                    return (
                                        <LinearProgress color='secondary'/>
                                    )
                                }
                                if (!project.isLoading){
                                    const sprintNames = project.project.details.sprint.map(sprint => sprint.name)
                                    return (
                                        <RenderScrumBoard sprint={project.project.details.sprint} sprintNames={sprintNames}/>
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


export default withStudentAuthSync(ScrumBoard);