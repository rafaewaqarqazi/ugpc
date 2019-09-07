import React, {useState} from 'react';
import {Badge, Chip, Divider, Grid, Hidden, Tooltip, Typography, Zoom} from "@material-ui/core";
import StudentVisionDocDetailsDialog from "./StudentVisionDocDetailsDialog";
import {
    getVisionDocsListBorderColor,
    getVisionDocsStatusChipColor
} from "../../../src/material-styles/visionDocsListBorderColor";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";

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
                project.length === 0?
                    <div className={classes.emptyList}>
                        <div
                            className={classes.emptyListContainer}
                        >
                            <div className={classes.emptyList}>
                                <Typography variant='subtitle2' color='textSecondary'>
                                    No Document Found
                                </Typography>
                            </div>
                        </div>
                    </div>
                    :project.documentation.visionDocument.map(doc=>(
                        <div key={doc._id}>
                            <Grid container spacing={1} className={classes.listItem} onClick={()=>openDetails(doc)}>
                                <Grid item xs={12} sm={2} className={classes.gridTransition}>
                                    <div className={classes.grid1} >
                                        <div>
                                            {
                                                project.students.map((student,index) =>(
                                                    <Tooltip key={index} title={student.student_details.regNo} placement="top" TransitionComponent={Zoom}>
                                                        <Avatar className={classes.avatar}>{student.name.charAt(0).toUpperCase()}</Avatar>
                                                    </Tooltip>
                                                ))
                                            }
                                        </div>
                                        <Tooltip title='Updated On' placement="top" TransitionComponent={Zoom}>
                                            <Typography variant="body2" style={{textAlign:'center'}}>{moment(doc.updatedAt).format('ddd MMM D, YYYY') }</Typography>
                                        </Tooltip>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={8} className={classes.gridTransition}>
                                    <Typography variant='h6' noWrap>{doc.title}</Typography>
                                    <Chip style={getVisionDocsStatusChipColor(doc.status)} label={doc.status}  size="small"/>
                                    <Tooltip title='Abstract' placement="top" TransitionComponent={Zoom}>
                                        <Typography className={classes.wrapText}  variant="body2" color="textSecondary" component="p" >{doc.abstract}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={2} className={classes.gridTransition}>
                                    <div className={classes.lastGrid}>
                                        <Badge  badgeContent={  doc.comments.length > 0 ? doc.comments.length: '0'} max={10} color='secondary' className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>
                                                Comments</Typography>
                                        </Badge>
                                        <Badge badgeContent={doc.majorModules.length} max={10} color='secondary' className={classes.badgeMargin}>
                                            <Typography className={classes.badgePadding} noWrap>Modules</Typography>
                                        </Badge>
                                    </div>

                                </Grid>
                            </Grid>
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