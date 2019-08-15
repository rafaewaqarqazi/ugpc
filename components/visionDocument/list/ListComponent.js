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

}));
const ListComponent = ({visionDocuments, projectName}) => {
    const classes = useStyles();
    const [openDetails,setOpenDetails] = useState(true);
    const [openDetailsMobile,setOpenDetailsMobile] = useState(false);
    const handleOpenDetails = ()=>{
        setOpenDetails(true)
    };
    const handleCloseDetails = ()=>{
        setOpenDetails(false)
    }
    return (
        <Container>
            <Grid container spacing={2}>

                {visionDocuments && visionDocuments.map((document, index) =>
                    <>
                        <Hidden mdUp>
                            <Grid item key={document._id} xs={12}>
                                <div  className={classes.paper}>
                                    <Typography variant='body2'>{document.title.length >10? `${document.title.slice(0,10)}...`:document.title}</Typography>
                                    <Chip color='primary' label={document.status.length >10? `${document.status.slice(0,10)}...`:document.status}  size="small"/>
                                    <Badge color="secondary" className={classes.margin} badgeContent={document.comments.length === 0?'0':document.comments.length}>
                                        <Typography  variant='body2'>Comments</Typography>
                                    </Badge>
                                </div>
                            </Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid item key={document._id} sm={openDetails?6:12}>
                            <div  className={classes.paper}  onClick={handleOpenDetails}>
                                <Typography color='primary' variant='body2'>
                                {openDetails ?
                                    projectName.length >8 ?
                                        `${projectName.slice(0,8)}...` :
                                        projectName
                                    :
                                    projectName.length >20 ?
                                        `${projectName.slice(0,20)}...` :
                                        projectName
                                }
                                </Typography>
                                <Typography  variant='body2' >
                                {openDetails ?
                                    document.title.length >8 ?
                                        `${document.title.slice(0,8)}...` :
                                        document.title
                                    :
                                    document.title.length >20 ?
                                        `${document.title.slice(0,20)}...` :
                                        document.title
                                }
                                </Typography>
                                <Chip color='primary' label={document.status}  size="small"/>
                                <Badge color="secondary" className={classes.margin} badgeContent={document.comments.length === 0?'0':document.comments.length}>
                                <Typography  variant='body2'>Comments</Typography>
                                </Badge>
                            </div>
                            </Grid>
                        </Hidden>

                        <Hidden mdUp>
                            <Grid item key={document._id} xs={12}>
                                {(openDetails || openDetailsMobile )&& (
                                    <div  className={classes.paper}>
                                        <Typography variant='body2'>{document.title.length >10? `${document.title.slice(0,10)}...`:document.title}</Typography>
                                        <Chip color='primary' label={document.status.length >10? `${document.status.slice(0,10)}...`:document.status}  size="small"/>
                                    </div>
                                )}
                            </Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid item key={document._id} sm={6} >
                                {openDetails &&
                                    <div >
                                        <div className={`${classes.detailsHead} ${classes.detailsContent}`}>
                                            <Typography color='textSecondary' variant='button'>
                                                {projectName.length >20? `${projectName.slice(0,20)}...`:projectName}
                                            </Typography>
                                            <Close onClick={handleCloseDetails} className={classes.detailsClose}/>
                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography variant='h6'>
                                                {document.title}
                                            </Typography>
                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography color='textSecondary'>
                                                    STATUS
                                            </Typography>
                                            <Chip color='primary' label={document.status}  size="small"/>
                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Abstract
                                            </Typography>
                                            <Typography variant='body2'>
                                                {document.abstract}
                                            </Typography>
                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Scope
                                            </Typography>
                                            <Typography variant='body2'>
                                                {document.scope}
                                            </Typography>
                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Major Modules
                                            </Typography>
                                            {
                                                document.majorModules.map((module,index)=>
                                                    <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                                )
                                            }

                                        </div>
                                        <div className={classes.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Comments
                                            </Typography>
                                            {
                                              document.comments ?
                                                  <Typography variant='h6' color='textSecondary'>
                                                            No Comments Yet
                                                  </Typography>
                                                  : document.comments.map(comment=>
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
                                                <a href={`${serverUrl}/../pdf/${document.document.filename}`} target="_blank">
                                                <Assignment style={{width: 50, height: 50}}/>
                                                </a>
                                            </Avatar>
                                        </div>
                                    </div>
                                }
                            </Grid>

                        </Hidden>
                    </>
                )}

            </Grid>
        </Container>
    );

};

export default ListComponent;