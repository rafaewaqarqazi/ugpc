import React, {useEffect, useContext, useState, Fragment} from 'react';
import {Container, LinearProgress} from "@material-ui/core";
import VisionDocsContext from '../../../context/visionDocs/visionDocs-context';
import {makeStyles} from "@material-ui/styles";
import ListVisionDocsForPresentation from "./ListVisionDocsForPresentation";


const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    }
}))
const PresentationComponent = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    const [empty,setEmpty] = useState(true);
    const classes = useStyles();
    useEffect(()=>{
        visionDocsContext.fetchByCommittee();
    },[]);

    const Render = ()=>{
        let documents = [];
        visionDocsContext.visionDocs.visionDocs.map((docs) => {
            if (docs._id.status==='Approved for Meeting'){
                documents = docs.projects
            }
        })
        if (documents.length > 0){
            return  <Container className={classes.container}>
                <ListVisionDocsForPresentation docs={documents}/>
            </Container>
        }
        else {
            return  <Container className={classes.container}>
                <ListVisionDocsForPresentation docs={[]}/>
            </Container>
        }
    }
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <LinearProgress /> :
                <Render />
            }


        </div>
    );
};

export default PresentationComponent;