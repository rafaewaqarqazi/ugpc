import React,{useState} from 'react';
import {
    Hidden,
    Typography,
    Badge,
    Grid,
    Chip, Container,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {blueGrey,green} from "@material-ui/core/colors";
import {Close, Assignment} from '@material-ui/icons'
import Avatar from "@material-ui/core/Avatar";
import {serverUrl} from "../../../utils/config";
const useStyles = makeStyles(theme =>({
    paper:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:theme.spacing(2),
        padding:theme.spacing(0.5),
        backgroundColor:blueGrey[50],
        cursor:'pointer'
    },
    detailsHead:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    detailsClose:{
        cursor:'pointer'
    },
    detailsContent:{
        marginBottom:theme.spacing(2)
    },
    majorModules:{
        marginRight:theme.spacing(0.5)
    },
    greenAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
        cursor:'pointer',
        width:80,
        height:80
    },
    wrapText:{
        maxWidth:400,
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    }

}));
const ListComponent = ({visionDocuments, projectName}) => {
    const classes = useStyles();
    const [openDetails,setOpenDetails] = useState(false);
    const [openDetailsMobile,setOpenDetailsMobile] = useState(false);
    const [currentDocument,setCurrentDocument] = useState(undefined);
    const handleOpenDetails = document => {
        setCurrentDocument(document);
        setOpenDetails(true)
    };
    const handleCloseDetails = ()=>{

        setOpenDetails(false);
        setCurrentDocument({})
    };
    return (
        <Container>
            <Grid container spacing={2}>

                <Grid item sm={openDetails?6:12} xs={12}>
                    {visionDocuments && visionDocuments.map((document, index) =>
                        <>
                            <Hidden mdUp>
                                    <div  className={classes.paper}>
                                        <Typography variant='body2' noWrap>{document.title}</Typography>
                                        <Chip color='primary'  label={document.status.length >10? `${document.status.slice(0,10)}...`:document.status}  size="small"/>
                                        <Badge color="secondary" className={classes.margin} badgeContent={document.comments.length === 0?'0':document.comments.length}>
                                            <Typography  variant='body2' noWrap>Comments</Typography>
                                        </Badge>
                                    </div>
                            </Hidden>
                            <Hidden smDown>

                                <div  className={classes.paper}  onClick={()=>handleOpenDetails(document)}>
                                    <Typography color='primary' variant='body2' noWrap>{projectName}</Typography>
                                    <Typography  variant='body2' noWrap>{document.title}</Typography>
                                    <Chip color='primary' label={document.status} size="small"/>
                                    <Badge color="secondary" className={classes.margin} badgeContent={document.comments.length === 0?'0':document.comments.length}>
                                    <Typography  variant='body2' noWrap>Comments</Typography>
                                    </Badge>
                                </div>

                            </Hidden>


                        </>
                    )}
                </Grid>
                <Grid item sm={openDetails?6:12} xs={12} >
                <Hidden mdUp>

                        {(openDetails || openDetailsMobile )&& currentDocument && (
                            <div  className={classes.paper}>
                                <Typography variant='body2'>{currentDocument.title.length >10? `${currentDocument.title.slice(0,10)}...`:currentDocument.title}</Typography>
                                <Chip color='primary' label={currentDocument.status.length >10? `${currentDocument.status.slice(0,10)}...`:currentDocument.status}  size="small"/>
                            </div>
                        )}

                </Hidden>
                <Hidden smDown>

                        {openDetails && currentDocument &&
                        <div >
                            <div className={`${classes.detailsHead} ${classes.detailsContent}`}>
                                <Typography color='textSecondary' variant='button' className={classes.wrapText}>
                                    {projectName.length >20? `${projectName.slice(0,20)}...`:projectName}
                                </Typography>
                                <Close onClick={handleCloseDetails} className={classes.detailsClose}/>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='h6' className={classes.wrapText}>
                                    {currentDocument.title}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip color='primary' label={currentDocument.status}  size="small"/>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Abstract
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.abstract}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Scope
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.scope}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Major Modules
                                </Typography>
                                {
                                    currentDocument.majorModules.map((module,index)=>
                                        <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                    )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Comments
                                </Typography>
                                {
                                    currentDocument.comments ?
                                        <Typography variant='h6' color='textSecondary'>
                                            No Comments Yet
                                        </Typography>
                                        : currentDocument.comments.map(comment=>
                                            <Typography variant='body2' key={comment._id}>
                                                {comment.text}
                                            </Typography>
                                        )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Document
                                </Typography>
                                <Avatar className={classes.greenAvatar} >
                                    <a href={`${serverUrl}/../pdf/${currentDocument.document.filename}`} target="_blank">
                                        <Assignment style={{width: 50, height: 50}}/>
                                    </a>
                                </Avatar>
                            </div>
                        </div>
                        }


                </Hidden>
                </Grid>

            </Grid>
        </Container>
    );

};

export default ListComponent;