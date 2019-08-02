import fetch from 'isomorphic-unfetch';
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {Typography} from "@material-ui/core";


const Index = ({data}) => {
    return (
        <LandingPageLayout>
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



        </LandingPageLayout>
    );
};
Index.getInitialProps = async function(){
    const res = await fetch('http://localhost:3000/api/projects/all');
    const data = await res.json();
    return {data}
};

export default Index;