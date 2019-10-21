import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import CircularLoading from "../../../components/loading/CircularLoading";
import MeetingsWithSupervisorComponent from "../../../components/project/meetings/MeetingsWithSupervisorComponent";
import ProjectContext from "../../../context/project/project-context";
import ProjectState from "../../../context/project/ProjectState";
const Meetings = () => {
    return (
        <ProjectState>
            <StudentPanelLayout>
                <ProjectContext.Consumer>
                    {
                        ({project})=>
                            project.isLoading ?
                                <CircularLoading />
                                :
                                <MeetingsWithSupervisorComponent meetings={project.project.details.meetings}/>
                    }
                </ProjectContext.Consumer>
            </StudentPanelLayout>
        </ProjectState>
    );
};

export default withStudentAuthSync(Meetings);