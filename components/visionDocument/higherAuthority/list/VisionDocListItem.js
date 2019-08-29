import React, { useState} from 'react';
import {Badge, Hidden, Typography} from "@material-ui/core";
import VisionDocDetailsDialog from "./VisionDocDetailsDialog";
import Divider from "@material-ui/core/Divider";
import {useListItemStyles} from "../../../../src/material-styles/listItemStyles";
import {getVisionDocsListBorderColor} from "../../../../src/material-styles/visionDocsListBorderColor";

const VisionDocListItem = ({filter, inputLabel, labelWidth,fetchData}) => {
    const classes = useListItemStyles();
    const [currentDocument,setCurrentDocument] = useState({});
    const [open,setOpen] = useState(false);

    const handleClose = ()=>{
        setOpen(false)
        setCurrentDocument({})
        if (fetchData){
            fetchData()
        }
    };
    const openDetails = details =>{
        setCurrentDocument(details);

        setOpen(true);
    };


    return (
        <div className={classes.listItemContainer}>
            {
                filter.length === 0?
                    <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                        <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                    </div>
                    :filter.map(doc=>(
                        <div key={doc.documentation.visionDocument._id}>
                            <Hidden smUp implementation="css">
                                <div className={classes.listItem} style={getVisionDocsListBorderColor(doc.documentation.visionDocument.status)} onClick={()=>openDetails(doc)}>
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
                                <div className={classes.listItem} style={getVisionDocsListBorderColor(doc.documentation.visionDocument.status)} onClick={()=>openDetails(doc)}>
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