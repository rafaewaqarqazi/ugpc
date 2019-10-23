import React, {useState} from 'react';
import {Divider, Typography} from "@material-ui/core";
import StudentVisionDocDetailsDialog from "./StudentVisionDocDetailsDialog";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

import {RenderListItemContent} from "../common/RenderListItemContent";

const StudentVisionListItem = ({project}) => {
    const classes = useListItemStyles();
    const [currentDocument,setCurrentDocument] = useState({});
    const [open,setOpen] = useState(false);

    const handleClose = ()=>{
        setOpen(false)
        setCurrentDocument({})
    };
    const openDetails = details =>{
        setCurrentDocument(details);

        setOpen(true);
    };
    return (
        <div className={classes.listItemContainer}>
            {
                project.documentation.visionDocument.length === 0?
                    <div className={classes.emptyList}>
                        <div className={classes.emptyListContainer}>
                            <div className={classes.emptyList}>
                                <Typography variant='subtitle2' color='textSecondary'>
                                    No Document Found
                                </Typography>
                            </div>
                        </div>
                    </div>
                    :project.documentation.visionDocument.map(doc=>(
                        <div key={doc._id} onClick={()=>openDetails(doc)}>
                            <RenderListItemContent
                                project={project}
                                doc={doc}
                                />
                            <Divider/>
                        </div>
                    ))}
            {
                open &&
                <StudentVisionDocDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    currentDocument={currentDocument}
                    project={project}
                    setCurrentDocument={setCurrentDocument}
                />
            }
        </div>
    );
};

export default StudentVisionListItem;