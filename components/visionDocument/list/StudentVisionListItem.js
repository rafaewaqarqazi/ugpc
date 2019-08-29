import React, {useState} from 'react';
import {Badge, Box, Container, Divider, Hidden, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import StudentVisionDocDetailsDialog from "./StudentVisionDocDetailsDialog";
import {getVisionDocsListBorderColor} from "../../../src/material-styles/visionDocsListBorderColor";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

const StudentVisionListItem = ({visionDocuments,students,projectId,projectTitle}) => {
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
                visionDocuments.length === 0?
                    <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                        <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                    </div>
                    :visionDocuments.map(doc=>(
                        <div key={doc._id}>
                            <Hidden smUp implementation="css">
                                <div className={classes.listItem} style={getVisionDocsListBorderColor(doc.status)} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemContent}>
                                        <div>
                                            <Typography noWrap>{projectTitle}</Typography>
                                            <Typography noWrap color='textSecondary'>{doc.status}</Typography>
                                        </div>
                                        <Badge color="secondary" badgeContent={doc.comments.length} className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>{
                                                doc.comments.length > 0 ?
                                                    'Comments':
                                                    'No Comments'
                                            }</Typography>
                                        </Badge>
                                    </div>
                                </div>
                            </Hidden>
                            <Hidden xsDown implementation="css">
                                <div className={classes.listItem} style={getVisionDocsListBorderColor(doc.status)} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemContent}>
                                        <Typography noWrap>{projectTitle}</Typography>
                                        <Typography noWrap color='textSecondary'>{doc.status}</Typography>
                                        <Badge color="secondary" badgeContent={doc.comments.length} className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>{
                                                doc.comments.length > 0 ?
                                                    'Comments':
                                                    'No Comments'
                                            }</Typography>
                                        </Badge>
                                    </div>
                                </div>
                            </Hidden>
                            <Divider/>
                        </div>
                    ))}
            {
                open &&
                <StudentVisionDocDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    currentDocument={currentDocument}
                    projectId={projectId}
                    students={students}
                    projectTitle={projectTitle}
                    setCurrentDocument={setCurrentDocument}
                />
            }

        </div>
    );
};

export default StudentVisionListItem;