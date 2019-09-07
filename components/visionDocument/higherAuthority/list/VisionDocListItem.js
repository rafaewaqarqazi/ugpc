import React, {useEffect, useState} from 'react';
import {Badge, Typography, Grid, Tooltip, Chip, Zoom} from "@material-ui/core";
import VisionDocDetailsDialog from "./VisionDocDetailsDialog";
import Divider from "@material-ui/core/Divider";
import {useListItemStyles} from "../../../../src/material-styles/listItemStyles";
import {
    getVisionDocsStatusChipColor
} from "../../../../src/material-styles/visionDocsListBorderColor";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import {getRandomColor} from "../../../../src/material-styles/randomColors";

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
    return (
        <div className={classes.listItemContainer}>
            {
                filter.length === 0?
                    <div className={classes.emptyList}>
                        <div
                            className={classes.emptyListContainer}
                        >
                            <div className={classes.emptyList}>
                                <Typography variant='subtitle2' color='textSecondary'>
                                    No Projects Found
                                </Typography>
                            </div>
                        </div>
                    </div>
                    :filter.map((doc,index)=>(
                        <div key={index}>
                            <Grid container spacing={1} className={classes.listItem} onClick={()=>openDetails(doc)}>
                                <Grid item xs={12} sm={2} className={classes.gridTransition}>
                                    <div className={classes.grid1} >
                                        <div>
                                            {
                                                doc.students.map((student,index) =>(
                                                    <Tooltip key={index} title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                                        <Avatar className={classes.avatar}>{student.name.charAt(0).toUpperCase()}</Avatar>
                                                    </Tooltip>
                                                ))
                                            }
                                        </div>
                                        <Tooltip title='Updated On' placement="top" TransitionComponent={Zoom}>
                                        <Typography variant="body2" style={{textAlign:'center'}}>{moment(doc.documentation.visionDocument.updatedAt).format('ddd MMM D, YYYY') }</Typography>
                                        </Tooltip>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={8} className={classes.gridTransition}>
                                    <Typography variant='h6' noWrap>{doc.documentation.visionDocument.title}</Typography>
                                    <Chip style={getVisionDocsStatusChipColor(doc.documentation.visionDocument.status)} label={doc.documentation.visionDocument.status}  size="small"/>
                                    <Tooltip title='Abstract' placement="top" TransitionComponent={Zoom}>
                                        <Typography className={classes.wrapText}  variant="body2" color="textSecondary" component="p" >{doc.documentation.visionDocument.abstract}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={2} className={classes.gridTransition}>
                                    <div className={classes.lastGrid}>
                                        <Badge  badgeContent={ doc.documentation.visionDocument.comments.length > 0 ? doc.documentation.visionDocument.comments.length: '0'} max={10} color='secondary' className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>
                                                    Comments</Typography>
                                        </Badge>
                                        <Badge badgeContent={doc.documentation.visionDocument.majorModules.length} max={10} color='secondary' className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>Modules</Typography>
                                        </Badge>
                                    </div>

                                </Grid>
                            </Grid>
                            <Divider/>
                        </div>
                    ))}
            {
                open &&(
                <VisionDocDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    currentDocument={currentDocument}
                    setCurrentDocument={setCurrentDocument}
                    inputLabel={inputLabel}
                    labelWidth={labelWidth}
                />)
            }

        </div>
    );
};

export default React.memo(VisionDocListItem);