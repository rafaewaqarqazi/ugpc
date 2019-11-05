import React, {useEffect, useState} from 'react';
import ChairmanOfficeLayout from "../../../components/Layouts/chairmanOfficeLayout";
import {
    AppBar,
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

import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import CloseIcon from "@material-ui/icons/Close";
import ApprovalLetter from "../../../components/approvalLetter/ApprovalLetter";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import CircularLoading from "../../../components/loading/CircularLoading";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import {PDFViewer} from "@react-pdf/renderer";

const Approval = () => {
    const tableClasses = useTableStyles();
    const documentClasses = useDocDetailsDialogStyles();
    const containerClasses = useListContainerStyles();
    const styles = useListItemStyles();
    const [status, setStatus] = useState('All');
    const [batch,setBatch] = useState('All');
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
    };
    useEffect(() =>{
        fetchData();
    }, []);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        filterData(event.target.value,batch)
    };
    const filterData =(department,sBatch)=>{
        let data = [];
        if(department === 'All' && sBatch === 'All'){
            setFilteredProjects(projects);
            setFilter(projects);
        }else if (department === 'All' && sBatch !== 'All'){
            projects.map(project => {
                if(project.students[0].student_details.batch === sBatch){
                    data=[
                        ...data,
                        project
                    ]
                }
            });
            setFilteredProjects(data);
            setFilter(data);
        }else if (department !== 'All' && sBatch === 'All'){
            projects.map(project => {
                if(project.department === department){
                    data=[
                        ...data,
                        project
                    ]
                }
            });
            setFilteredProjects(data);
            setFilter(data);
        }else {
            projects.map(project => {
                if(project.students[0].student_details.batch === sBatch && project.department === department){
                    data=[
                        ...data,
                        project
                    ]
                }
            });
            setFilteredProjects(data);
            setFilter(data);
        }
    }
    const handleChangeBatch =(event)=> {
        setBatch(event.target.value);
        filterData(status,event.target.value)
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
                <div className={containerClasses.listContainer}>
                    <div className={containerClasses.top}>
                        <div className={containerClasses.topIconBox} >
                            <AssignmentOutlined className={containerClasses.headerIcon}/>
                        </div>
                        <div className={containerClasses.topTitle} >
                            <Typography variant='h5'>Approval Letters</Typography>
                        </div>
                    </div>

                    <div >
                        <div className={containerClasses.listHeader}>
                            <FormControl variant="outlined"  margin='dense' className={containerClasses.formControl} >
                                <InputLabel htmlFor="department">
                                    Department
                                </InputLabel>
                                <Select
                                    value={status}
                                    onChange={handleChange}
                                    input={<OutlinedInput labelWidth={87}  name="department" id="department" />}
                                >
                                    <MenuItem value='All'>All</MenuItem>
                                    <MenuItem value='BSSE'>BSSE</MenuItem>
                                    <MenuItem value='BSCS'>BSCS</MenuItem>
                                    <MenuItem value='BSIT'>BSIT</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" margin='dense' className={containerClasses.formControl}>
                                <InputLabel htmlFor="batch">
                                    Batch
                                </InputLabel>
                                <Select
                                    value={batch}
                                    onChange={handleChangeBatch}
                                    input={<OutlinedInput labelWidth={42} name="batch" id="batch" />}
                                >
                                    <MenuItem value='All'>All</MenuItem>
                                    <MenuItem value='F15'>F15</MenuItem>
                                    <MenuItem value='F16'>F16</MenuItem>
                                    <MenuItem value='F17'>F17</MenuItem>
                                    <MenuItem value='F18'>F18</MenuItem>
                                </Select>
                            </FormControl>
                            <div style={{flexGrow:1}}/>
                            <TextField
                                variant="outlined"
                                label="Search"
                                name='search'
                                margin='dense'

                                placeholder='Project Title here'
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
                                <div className={tableClasses.tableWrapper}>

                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Title</TableCell>
                                                <TableCell align="left">Department</TableCell>
                                                <TableCell align="left">Batch</TableCell>
                                                <TableCell align="left">RegistrationNo</TableCell>
                                                <TableCell align="left">Supervisor</TableCell>
                                                <TableCell align="left">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {
                                                filter.length === 0  ?
                                                    <TableRow >
                                                        <TableCell colSpan={6}>
                                                            <div className={styles.emptyListContainer}>
                                                                <div className={styles.emptyList}>
                                                                    No Projects Found
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>:
                                                filter.map((project,index) => (
                                                    <Tooltip key={index} title='Click to view Details' placement="top-start" TransitionComponent={Zoom}>
                                                        <TableRow className={tableClasses.tableRow} >
                                                            <TableCell align="left" >{project.documentation.visionDocument.title}</TableCell>
                                                            <TableCell align="left" >{project.department}</TableCell>
                                                            <TableCell align="left" >{project.students[0].student_details.batch}</TableCell>
                                                            <TableCell >
                                                                {
                                                                    project.students.map((student,index) =>
                                                                        <span key={index}>
                                                                            {` ${index === 1 ? ' & ':''}${student.student_details.regNo.slice(0,4)}`}
                                                                        </span>
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
                        <Typography variant="h6" className={documentClasses.title} noWrap>
                            Auto Generated Acceptance Letter
                        </Typography>
                        <IconButton edge="start" color='inherit'  onClick={()=>setLetterViewer(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{height:500}}>
                    {
                        document.details &&(
                            <PDFViewer style={{width:'100%',height:'100%'}}>
                            <ApprovalLetter
                                title={document.documentation.visionDocument.title}
                                students={document.students}
                                supervisor={document.details.supervisor}
                                date={document.details.acceptanceLetter.issueDate}
                                chairmanName={chairmanName ? chairmanName : "No Chairman"}
                            />
                            </PDFViewer>
                            )
                    }

                </DialogContent>
            </Dialog>
        </ChairmanOfficeLayout>
    );
};

export default withChairmanOfficeAuthSync(Approval);