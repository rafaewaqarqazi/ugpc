import React, {useState, useEffect, useRef} from 'react';
import {makeStyles} from "@material-ui/styles";
import {
    Typography, Box, Container, Divider, Button, Badge, Hidden,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput, TextField,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Chip
} from "@material-ui/core";
import {Assignment, Search} from '@material-ui/icons';
import Avatar from "@material-ui/core/Avatar";
import {serverUrl} from "../../../../utils/config";
import {green} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme=>({
    listContainer:{
        padding:theme.spacing(2),
        marginTop: theme.spacing(8),
    },
    wrapText:{
        maxWidth:400,
        whiteSpace: 'normal',
        wordWrap: 'break-word'
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
        padding: theme.spacing(1.2),
        '&:hover':{
            padding:theme.spacing(1.7),
        },
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    top:{
        width: theme.spacing(11),
        height:theme.spacing(11),
        backgroundColor: theme.palette.secondary.dark,
        color:'#fff',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center',
        marginTop:-theme.spacing(5),
        marginBottom:theme.spacing(5)
    },
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        boxShadow:'10'
    },
    badgeMargin: {
        margin: theme.spacing(0.5),
    },
    badgePadding: {
        padding: theme.spacing(0, 1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    detailsContent:{
        marginBottom:theme.spacing(2)
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
const ListVisionDocs = ({docs}) => {
    const classes = useStyles();
    const [status, setStatus] = useState('All');
    const [documents,setDocuments]=useState([]);
    const [filter,setFilter] = useState([]);
    const [open,setOpen] = useState(false);
    const [currentDocument,setCurrentDocument] = useState({});
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        const data = [
            ...docs.waiting,
            ...docs.waitingForSchedule,
            ...docs.meetingScheduled,
            ...docs.approvedWithChanges,
            ...docs.approved,
            ...docs.rejected
        ];
        setDocuments(data);
        setFilter(data);

    }, []);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        let data = [];
        switch (event.target.value) {
            case 'All':
                 data = [
                    ...docs.waiting,
                    ...docs.waitingForSchedule,
                    ...docs.meetingScheduled,
                    ...docs.approvedWithChanges,
                    ...docs.approved,
                    ...docs.rejected
                ];
                setDocuments(data);
                setFilter(data);
                break;
            case 'Waiting for Initial Approval':
                 data = [
                    ...docs.waiting,
                ];
                setDocuments(data);
                setFilter(data);

                break;
            case 'Waiting for Meeting Schedule':
                data =[
                    ...docs.waitingForSchedule,
                ]
                setDocuments(data);
                setFilter(data);
                break;
        }
    }
    const handleChangeSearch = e =>{
        const data = documents;
        setFilter(e.target.value !==''? data.filter(doc => doc.title.toLowerCase().includes(e.target.value.toLowerCase())) : documents)
    }
    const openDetails = details =>{
        setCurrentDocument(details);

        setOpen(true);
    }
    const handleClose = ()=>{
        setOpen(false)
        setCurrentDocument({})
    }
    return (
        <div>
            <Box boxShadow={10} className={classes.listContainer}>
                <Box boxShadow={10} className={classes.top}>
                    <Assignment fontSize='large'/>
                </Box>


                <Box boxShadow={3} p={2}>
                    <div className={classes.listHeader}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabel} htmlFor="status">
                                Status
                            </InputLabel>
                            <Select
                                value={status}
                                onChange={handleChange}
                                input={<OutlinedInput labelWidth={labelWidth} name="status" id="status" />}
                            >
                                <MenuItem value='All'>All</MenuItem>
                                <MenuItem value='Waiting for Initial Approval'>Waiting for Initial Approval</MenuItem>
                                <MenuItem value='Waiting for Meeting Schedule'>Waiting for Meeting Schedule</MenuItem>
                                <MenuItem value='Meeting Scheduled'>Meeting Scheduled</MenuItem>
                                <MenuItem value='Approved with Changes'>Approved with Changes</MenuItem>
                                <MenuItem value='Approved'>Approved</MenuItem>
                                <MenuItem value='Rejected'>Rejected</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            variant="outlined"
                            label="Search"
                            name='search'
                            placeholder='Search For Projects'
                            onChange={handleChangeSearch}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />

                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <Divider/>

                    <Container style={{marginTop:10}}>
                        {
                            filter.length === 0?
                                <div>
                                    <Typography variant='h5' color='textSecondary'>No Documents Found</Typography>
                                </div>
                            :filter.map(doc=>(
                            <Box boxShadow={2} mb={0.5}  >
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

                            </Box>
                        ))}

                    </Container>
                </Box>
            </Box>
            <Dialog
                fullWidth={true}
                maxWidth='md'
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
            >

                <DialogTitle id="dialog-title">{currentDocument.title}</DialogTitle>
                {open && <>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.detailsContent}>
                                <Typography color='textSecondary'>
                                    STATUS
                                </Typography>
                                <Chip color='primary' label={currentDocument.documentation.visionDocument.status}  size="small"/>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Abstract
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.documentation.visionDocument.abstract}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Scope
                                </Typography>
                                <Typography variant='body2' className={classes.wrapText}>
                                    {currentDocument.documentation.visionDocument.scope}
                                </Typography>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Major Modules
                                </Typography>
                                {
                                    currentDocument.documentation.visionDocument.majorModules.map((module,index)=>
                                        <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                                    )
                                }

                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Students
                                </Typography>
                                {
                                    currentDocument.students.map((student,index)=>
                                        <Container>
                                            <Typography variant='body2' >
                                                {student.name}
                                            </Typography>
                                            <Typography variant='overline' color='textSecondary'>
                                                {student.student_details.regNo}
                                            </Typography>
                                        </Container>
                                    )
                                }

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Document
                                </Typography>
                                <Avatar className={classes.greenAvatar} style={{borderRadius:0}}>
                                    <a href={`${serverUrl}/../pdf/${currentDocument.documentation.visionDocument.document.filename}`} target="_blank" >
                                        <Assignment style={{width: 50, height: 50,color: '#fff'}} />
                                    </a>
                                </Avatar>
                            </div>
                            <div className={classes.detailsContent}>
                                <Typography variant='subtitle2'>
                                    Comments
                                </Typography>
                                {
                                    currentDocument.documentation.visionDocument.comments ?
                                        <Typography variant='h6' color='textSecondary'>
                                            No Comments Yet
                                        </Typography>
                                        : currentDocument.documentation.visionDocument.comments.map(comment=>
                                            <Typography variant='body2' key={comment._id}>
                                                {comment.text}
                                            </Typography>
                                        )
                                }

                            </div>

                        </Grid>
                    </Grid>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Close
                        </Button>
                    </DialogActions>
                    </>
                }


            </Dialog>
        </div>
    );
};

export default ListVisionDocs;