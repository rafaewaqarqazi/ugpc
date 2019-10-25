import React, {useEffect, useContext} from 'react';
import {Container, LinearProgress} from "@material-ui/core";
import VisionDocsContext from '../../../context/visionDocs/visionDocs-context';
import ListVisionDocsForPresentation from "./ListVisionDocsForPresentation";

const PresentationComponent = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    useEffect(()=>{
        visionDocsContext.fetchByCommittee();
    },[]);

    const Render = ()=>{
        let documents = [];
        visionDocsContext.visionDocs.visionDocs.map((docs) => {
            if (docs._id.status==='Approved for Meeting'){
                documents = docs.projects
            }
        });
        if (documents.length > 0){
            return  <Container >
                <ListVisionDocsForPresentation docs={documents}/>
            </Container>
        }
        else {
            return  <Container>
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