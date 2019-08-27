import React, { useState} from 'react';
import {Badge, Hidden, Typography} from "@material-ui/core";
import VisionDocDetailsDialog from "./VisionDocDetailsDialog";
import Divider from "@material-ui/core/Divider";
import {useListItemStyles} from "../../../../src/material-styles/listItemStyles";


const VisionDocListItem = ({filter, inputLabel, labelWidth}) => {
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

    const getBorderColor = status =>{
        if (status === 'Waiting for Initial Approval'){
            return {
                borderLeft:'4px solid #1A237E'
            }
        }
        else if (status === 'Approved for Meeting'){
            return {
                borderLeft:'4px solid #1565C0'
            }
        }
        else if (status === 'Meeting Scheduled'){
            return {
                borderLeft:'4px solid #FBC02D'
            }
        }
        else if (status === 'Approved with Changes'){
            return {
                borderLeft:'4px solid #004D40'
            }
        }
        else if (status === 'Approved'){
            return {
                borderLeft:'4px solid #4CAF50'
            }
        }
        else if (status === 'Rejected'){
            return {
                borderLeft:'4px solid #b71c1c'
            }
        }
    }
    return (
        <div className={classes.listItemContainer}>
            {
                filter.length === 0?
                    <div>
                        <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                    </div>
                    :filter.map(doc=>(
                        <div key={doc.documentation.visionDocument._id}>
                            <Hidden smUp implementation="css">
                                <div className={classes.listItem} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemColor}/>

                                    <div className={classes.listItemContent}>
                                        <div>
                                            <Typography noWrap>{doc.title}</Typography>
                                            <Typography noWrap color='textSecondary'>{doc.documentation.visionDocument.status}</Typography>
                                        </div>
                                        <Badge color="secondary" badgeContent={doc.documentation.visionDocument.comments.length} className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>{
                                                doc.documentation.visionDocument.comments.length > 0 ?
                                                    'Comments':
                                                    'No Comments'
                                            }</Typography>
                                        </Badge>
                                    </div>

                                </div>
                            </Hidden>
                            <Hidden xsDown implementation="css">
                                <div className={classes.listItem} style={getBorderColor(doc.documentation.visionDocument.status)} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemContent}>
                                        <Typography noWrap>{doc.title}</Typography>
                                        <Typography noWrap color='textSecondary'>{doc.documentation.visionDocument.status}</Typography>
                                        <Badge color="secondary" badgeContent={doc.documentation.visionDocument.comments.length} className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>{
                                                doc.documentation.visionDocument.comments.length > 0 ?
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
                <VisionDocDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    currentDocument={currentDocument}
                    setCurrentDocument={setCurrentDocument}
                    inputLabel={inputLabel}
                    labelWidth={labelWidth}
                />
            }

        </div>
    );
};

export default VisionDocListItem;