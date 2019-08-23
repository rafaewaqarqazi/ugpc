import React, {useState} from 'react';
import {Badge, Box, Container, Divider, Hidden, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import StudentVisionDocDetailsDialog from "./StudentVisionDocDetailsDialog";

const useStyles = makeStyles(theme =>({
    listItemContainer:{
      marginTop:theme.spacing(2)
    },
    listItem:{
        display:'flex',
        cursor:'pointer',

    },
    listItemColor:{
        backgroundColor:theme.palette.secondary.light,
        minHeight:'100%',
        minWidth:theme.spacing(0.6)
    },
    listItemContent:{
        padding: theme.spacing(0.7),
        '&:hover':{
            boxShadow:theme.shadows[7],
        },
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    badgeMargin: {
        margin: theme.spacing(0.5),
    },
    badgePadding: {
        padding: theme.spacing(0, 1),
    },
}))
const StudentVisionListItem = ({visionDocuments,students,projectId,projectTitle}) => {
    const classes = useStyles();
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
                    <div>
                        <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                    </div>
                    :visionDocuments.map(doc=>(
                        <div key={doc._id}>
                            <Hidden smUp implementation="css">
                                <div className={classes.listItem} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemColor}/>

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
                                <div className={classes.listItem} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemColor}/>

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