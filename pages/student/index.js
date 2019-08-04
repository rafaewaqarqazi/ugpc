import fetch from 'isomorphic-unfetch';
import {Typography} from "@material-ui/core";
import StudentRouter from "../../components/routers/StudentRouter";
const Index = ({data}) => {
    return (
        <StudentRouter>
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
        </StudentRouter>
    );
};
Index.getInitialProps = async function(){
    const res = await fetch('http://localhost:3000/api/projects/all');
    const data = await res.json();
    return {data}
};

export default Index;