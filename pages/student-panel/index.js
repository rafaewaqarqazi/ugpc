import fetch from 'isomorphic-unfetch';
import StudentPanelLayout from "../../components/Layouts/StudentPanelLayout";
import {Typography} from "@material-ui/core";
import {isAuthenticated} from "../../auth";
import router from 'next/router';
import StudentRouter from "../../components/StudentRouter";
const Index = ({data}) => {
    return (
        <StudentRouter>
            <StudentPanelLayout>
            {data.map((project,index)=>(
                    <div key={index}>
                        <Typography variant='h4' >
                            {`Project No.${index}: ${project.title}`}
                        </Typography>

                        <Typography paragraph>
                            {project.description}
                        </Typography>
                    </div>
                )
            )}
            </StudentPanelLayout>
        </StudentRouter>
    );
};
Index.getInitialProps = async function(){
    const res = await fetch('http://localhost:3000/api/projects/all');
    const data = await res.json();
    return {data}
};

export default Index;