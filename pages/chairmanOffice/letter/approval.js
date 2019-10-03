import React, {useEffect, useState} from 'react';
import ChairmanOfficeLayout from "../../../components/Layouts/chairmanOfficeLayout";
import {
    AppBar,
    Avatar,
    Container, Dialog, DialogContent, Divider,
    FormControl, IconButton, InputAdornment,
    InputLabel, ListItemIcon, Menu,
    MenuItem,
    OutlinedInput,
    Select, Table, TableBody, TableCell, TableHead, TableRow,
    TextField, Toolbar, Tooltip,
    Typography, Zoom
} from "@material-ui/core";
import {
    AssignmentOutlined,
    AssignmentTurnedInOutlined, Close,
    MoreVertOutlined,
    Search
} from "@material-ui/icons";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {withChairmanOfficeAuthSync} from "../../../components/routers/chairmanOfficeAuth";
import {fetchForApprovalLetterAPI} from "../../../utils/apiCalls/projects";

import {makeStyles} from "@material-ui/styles";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import CloseIcon from "@material-ui/icons/Close";
import ApprovalLetter from "../../../components/approvalLetter/ApprovalLetter";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import CircularLoading from "../../../components/loading/CircularLoading";
const useStyles = makeStyles(theme =>({
    tableRow:{
        "&:hover":{

            boxShadow:theme.shadows[6]
        }
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflow:'auto',
        maxHeight:450
    }
}));
const Approval = () => {
    const projectsClasses = useStyles();
    const documentClasses = useDocDetailsDialogStyles();
    const classes = useListContainerStyles();
    const styles = useListItemStyles();
    const [status, setStatus] = useState('All');
    const [projects,setProjects]=useState([]);
    const [filteredProjects,setFilteredProjects] = useState([]);
    const [filter,setFilter] = useState([]);
    const [document,setDocument] = useState({});
    const [letterViewer,setLetterViewer] = useState(false);
    const [chairmanName,setChairmanName] = useState('');
    const [anchorEl,setAnchorEl] = useState(null);
    const [loading,setLoading] = useState(true);
    const fetchData = ()=>{
        setLoading(true);
        fetchForApprovalLetterAPI()
            .then(result =>{
                setProjects(result.projects);
                setFilter(result.projects);
                setChairmanName(result.chairman);
                setFilteredProjects(result.projects);
                setLoading(false);
            })
    }
    useEffect(() =>{
        fetchData();
    }, []);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        switch (event.target.value) {
            case 'All':
                setFilteredProjects(projects);
                setFilter(projects);
                break;
            case event.target.value :
                let data = [];
                projects.map(project => {
                    if(project.department === event.target.value){
                        data=[
                            ...data,
                            project
                        ]
                    }
                });
                setFilteredProjects(data);
                setFilter(data);
                break;
        }
    };
    const handleChangeSearch = e =>{
        const data = filteredProjects;
        setFilter(e.target.value !==''? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : filteredProjects)
    };
    const handleViewAcceptanceLetter = details =>{
        setDocument(details);
        setLetterViewer(true);
    }
    return (
        <ChairmanOfficeLayout>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <AssignmentOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>Approval Letters</Typography>
                        </div>
                    </div>

                    <div >
                        <div className={classes.listHeader}>
                            <FormControl variant="outlined" margin='dense' style={{minWidth:160}}>
                                <InputLabel htmlFor="department">
                                    Department
                                </InputLabel>
                                <Select
                                    value={status}
                                    onChange={handleChange}
                                    input={<OutlinedInput labelWidth={87} name="department" id="department" />}
                                >
                                    <MenuItem value='All'>All</MenuItem>
                                    <MenuItem value='BSSE'>BSSE</MenuItem>
                                    <MenuItem value='BSCS'>BSCS</MenuItem>
                                    <MenuItem value='BSIT'>BSIT</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                variant="outlined"
                                label="Search"
                                name='search'
                                margin='dense'
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
                        {
                            loading ? <CircularLoading/> :
                            filter.length === 0  ?
                                <div className={styles.emptyListContainer}>
                                    <div className={styles.emptyList}>
                                        No Projects Found
                                    </div>
                                </div>:
                                <div className={projectsClasses.tableWrapper}>

                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Title</TableCell>
                                                <TableCell align="left">Department</TableCell>
                                                <TableCell align="left">Students</TableCell>
                                                <TableCell align="left">Supervisor</TableCell>
                                                <TableCell align="left">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {
                                                filter.map((project,index) => (
                                                    <Tooltip key={index} title='Click to view Details' placement="top-start" TransitionComponent={Zoom}>
                                                        <TableRow className={projectsClasses.tableRow} >
                                                            <TableCell align="left" >{project.documentation.visionDocument.title}</TableCell>
                                                            <TableCell align="left" >{project.department}</TableCell>
                                                            <TableCell style={{display:'flex'}}>
                                                                {
                                                                    project.students.map((student,index) =>
                                                                        <Tooltip key={index} title={student.student_details.regNo} placement='top'>
                                                                            <Avatar className={styles.avatar}>
                                                                                {
                                                                                    student.name.charAt(0).toUpperCase()
                                                                                }
                                                                            </Avatar>
                                                                        </Tooltip>
                                                                    )
                                                                }
                                                            </TableCell>
                                                            <Tooltip  title={project.details.supervisor.supervisor_details.position} placement="top" TransitionComponent={Zoom}>
                                                                <TableCell align="left" style={{textTransform:'capitalize'}}>{project.details.supervisor.name}</TableCell>
                                                            </Tooltip>
                                                            <TableCell align="left">
                                                                <Tooltip title='Click for Actions' placement='top'>
                                                                    <IconButton size='small' onClick={(event)=>setAnchorEl(event.currentTarget)}>
                                                                        <MoreVertOutlined/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Menu
                                                                    id="simple-menu"
                                                                    anchorEl={anchorEl}
                                                                    keepMounted
                                                                    open={Boolean(anchorEl)}
                                                                    onClose={()=>setAnchorEl(null)}
                                                                >

                                                                    <MenuItem onClick={()=>handleViewAcceptanceLetter(project)}>
                                                                        <ListItemIcon>
                                                                            <AssignmentTurnedInOutlined />
                                                                        </ListItemIcon>
                                                                        <Typography variant="inherit" noWrap>
                                                                            View Acceptance Letter
                                                                        </Typography>
                                                                    </MenuItem>
                                                                    <MenuItem onClick={()=>setAnchorEl(null)}>
                                                                        <ListItemIcon>
                                                                            <Close />
                                                                        </ListItemIcon>
                                                                        <Typography variant="inherit" noWrap>
                                                                            Cancel
                                                                        </Typography>
                                                                    </MenuItem>

                                                                </Menu>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Tooltip>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                        }

                    </div>
                </div>
            </Container>
            <Dialog open={letterViewer} onClose={()=>setLetterViewer(false)} fullScreen>
                <AppBar className={documentClasses.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color='inherit'  onClick={()=>setLetterViewer(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={documentClasses.title} noWrap>
                            Auto Generated Acceptance Letter
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{height:500}}>
                    {
                        document.details &&(
                            <ApprovalLetter
                                title={document.documentation.visionDocument.title}
                                students={document.students}
                                supervisor={document.details.supervisor}
                                date={document.details.acceptanceLetter.issueDate}
                                chairmanName={chairmanName ? chairmanName : "No Chairman"}
                            />)
                    }

                </DialogContent>
            </Dialog>
        </ChairmanOfficeLayout>
    );
};

export default withChairmanOfficeAuthSync(Approval);