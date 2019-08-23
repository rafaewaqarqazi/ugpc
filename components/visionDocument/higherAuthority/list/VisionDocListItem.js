import React, { useState} from 'react';
import {Badge, Box, Container, Hidden, Typography} from "@material-ui/core";
import VisionDocDetailsDialog from "./VisionDocDetailsDialog";
import {makeStyles} from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";

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
            boxShadow:theme.shadows[6],
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

const VisionDocListItem = ({filter, inputLabel, labelWidth}) => {
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
                filter.length === 0?
                    <div>
                        <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                    </div>
                    :filter.map(doc=>(
                        <div>
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
                                <div className={classes.listItem} onClick={()=>openDetails(doc)}>
                                    <div className={classes.listItemColor}/>

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