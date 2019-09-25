import React, {useContext, useEffect} from 'react';
import {LinearProgress} from "@material-ui/core";
import VisionDocsContext from '../../context/visionDocs/visionDocs-context';

import VisionDocListItem from "./higherAuthority/list/VisionDocListItem";

const SupervisorVisionDocs = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    useEffect(()=>{
        visionDocsContext.fetchBySupervisor();
    },[]);
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <LinearProgress /> :(
                <VisionDocListItem
                    filter={visionDocsContext.visionDocs.visionDocs}
                />
            )}
        </div>
    );
};

export default SupervisorVisionDocs;