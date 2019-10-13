import React, {useContext, useEffect} from 'react';
import VisionDocsContext from '../../context/visionDocs/visionDocs-context';

import VisionDocListItem from "./higherAuthority/list/VisionDocListItem";
import CircularLoading from "../loading/CircularLoading";

const SupervisorVisionDocs = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    useEffect(()=>{
        visionDocsContext.fetchBySupervisor();
    },[]);
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <CircularLoading /> :(
                <VisionDocListItem
                    filter={visionDocsContext.visionDocs.visionDocs}
                    userType='Supervisor'
                />
            )}
        </div>
    );
};

export default SupervisorVisionDocs;