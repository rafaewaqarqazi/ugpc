import React, {useEffect, useContext} from 'react';
import {Container, LinearProgress} from "@material-ui/core";
import VisionDocsContext from '../../context/visionDocs/visionDocs-context';
import {makeStyles} from "@material-ui/styles";
import ListVisionDocsForPresentation from "./ListVisionDocsForPresentation";


const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    }
}))
const PresentationComponent = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    const classes = useStyles();
    useEffect(()=>{
        visionDocsContext.fetchByCommittee();
    },[]);
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <LinearProgress /> :
                <Container className={classes.container}>
                    <ListVisionDocsForPresentation docs={visionDocsContext.visionDocs.visionDocs.approvedForMeeting}/>
                </Container>
            }

        </div>
    );
};

export default PresentationComponent;