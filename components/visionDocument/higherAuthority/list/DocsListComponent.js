import React, {useContext, useEffect} from 'react';
import {Container, LinearProgress} from "@material-ui/core";
import VisionDocsContext from '../../../../context/visionDocs/visionDocs-context';
import ListVisionDocs from "./ListVisionDocs";
import {makeStyles} from "@material-ui/styles";


const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    }
}));
const DocsListComponent = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    const classes = useStyles();
    useEffect(()=>{
        visionDocsContext.fetchByCommittee(true);
    },[]);
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <LinearProgress /> :(
                <Container className={classes.container}>
                    <ListVisionDocs docs={visionDocsContext.visionDocs.visionDocs}/>
                </Container>)
                }

        </div>
    );
};

export default DocsListComponent;