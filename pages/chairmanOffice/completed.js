import React, {useEffect, useState} from 'react';
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import ChairmanOfficeLayout from "../../components/Layouts/chairmanOfficeLayout";
import {withChairmanOfficeAuthSync} from "../../components/routers/chairmanOfficeAuth";
import {
    Button,
    Chip,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    FormControl, Grid, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select, Table, TableBody, TableCell, TableHead, TableRow,
    TextField, Tooltip,
    Typography, Zoom
} from "@material-ui/core";
import {AssignmentOutlined, Close, Search} from "@material-ui/icons";
import CircularLoading from "../../components/loading/CircularLoading";
import RenderStudents from "../../components/visionDocument/common/RenderStudents";
import {useTableStyles} from "../../src/material-styles/tableStyles";
import {useDocDetailsDialogStyles} from "../../src/material-styles/docDetailsDialogStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import {fetchCompletedProjectsAPI} from "../../utils/apiCalls/projects";
import {getGrade} from "../../utils";

const Completed = () => {
    const tableClasses = useTableStyles();
    const classes = useListContainerStyles();
    const detailsClasses = useDocDetailsDialogStyles();
    const styles = useListItemStyles();
    const [status, setStatus] = useState('All');
    const [batch,setBatch] = useState('All');
    const [projects,setProjects]=useState([]);
    const [filteredProjects,setFilteredProjects] = useState([]);
    const [filter,setFilter] = useState([]);
    const [details,setDetails] = useState({});
    const [openDetails,setOpenDetails] = useState(false);
    const [loading,setLoading] = useState(true);
    const fetchData = ()=>{
        setLoading(true);
        fetchCompletedProjectsAPI()
            .then(result =>{
                console.log(result);
                setProjects(result);
                setFilter(result);
                setFilteredProjects(result);
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
    const handleDetails = details =>{
        setDetails(details);
        setOpenDetails(true);
    };

    return (
        <ChairmanOfficeLayout>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <AssignmentOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>Completed Projects</Typography>
                        </div>
                    </div>

                    <div >
                        <div className={classes.listHeader}>
                            <FormControl variant="outlined"  margin='dense' style={{minWidth:160,marginRight:2}} >
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
                            <FormControl variant="outlined" margin='dense' style={{minWidth:160,marginRight:2}}>
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
                                            <TableCell align="left">RegistrationNo</TableCell>
                                            <TableCell align="left">Title</TableCell>
                                            <TableCell align="left">Department</TableCell>
                                            <TableCell align="left">Batch</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="left">Supervisor</TableCell>
                                            <TableCell align="left">Grade</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {
                                            filter.length === 0  ?
                                                <TableRow >
                                                    <TableCell colSpan={7}>
                                                        <div className={styles.emptyListContainer}>
                                                            <div className={styles.emptyList}>
                                                                No Projects Found
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>:
                                            filter.map((project,index) => (
                                                <Tooltip key={index} title='Click to view Details' placement="left" TransitionComponent={Zoom} onClick={()=>handleDetails(project)}>
                                                    <TableRow className={tableClasses.tableRow} >
                                                        <TableCell >
                                                            {
                                                                project.students.map((student,index) =>
                                                                    <div key={index}>
                                                                        {`${student.student_details.regNo.slice(0,4)} ${index === 1 ? '& ':''}`}
                                                                    </div>
                                                                )
                                                            }
                                                        </TableCell>
                                                        <TableCell  >{project.documentation.visionDocument.title}</TableCell>
                                                        <TableCell  >{project.department}</TableCell>
                                                        <TableCell >{project.students[0].student_details.batch}</TableCell>

                                                        <TableCell>{project.documentation.finalDocumentation.status}</TableCell>
                                                        <Tooltip  title={project.details.supervisor.supervisor_details.position} placement="top" TransitionComponent={Zoom}>
                                                            <TableCell  style={{textTransform:'capitalize'}}>{project.details.supervisor.name}</TableCell>
                                                        </Tooltip>
                                                        <TableCell style={{textTransform:'capitalize'}}>{getGrade(project.details.marks)}</TableCell>

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
            {
                openDetails &&
                <Dialog open={openDetails} onClose={()=>setOpenDetails(false)} fullWidth maxWidth='md'>
                    <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                        <Typography variant='h6' noWrap style={{flexGrow:1}}>Details</Typography>
                        <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                            <IconButton size='small' onClick={()=>setOpenDetails(false)}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <div className={detailsClasses.detailsContent}>
                                    <Typography  variant='subtitle2'>
                                        Title
                                    </Typography>
                                    <Typography variant='body2' className={classes.wrapText}>
                                        {details.documentation.visionDocument.title}
                                    </Typography>
                                </div>

                                <div className={detailsClasses.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        STATUS
                                    </Typography>
                                    <Chip  label={details.documentation.finalDocumentation.status} color='secondary'  size="small"/>
                                </div>
                                <div className={detailsClasses.detailsContent}>
                                    <RenderStudents students={details.students}/>
                                </div>
                                <div className={detailsClasses.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        Marks
                                    </Typography>
                                    <Container>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Vision Document
                                            </Typography>

                                            <Typography variant='body2'>
                                                {details.details.marks.visionDocument}
                                            </Typography>

                                        </div>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Supervisor
                                            </Typography>

                                            <Typography variant='body2'>
                                                {details.details.marks.supervisor}
                                            </Typography>

                                        </div>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Internal
                                            </Typography>

                                            <Typography variant='body2'>
                                                {details.details.marks.internal}
                                            </Typography>

                                        </div>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                External
                                            </Typography>

                                            <Typography variant='body2' >
                                                {details.details.marks.external}
                                            </Typography>

                                        </div>
                                    </Container>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className={detailsClasses.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        Examination Committee
                                    </Typography>
                                    <Container>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                Internal
                                            </Typography>
                                            <Container>
                                                <Typography variant='body2' style={{textTransform:"capitalize"}} className={classes.wrapText}>
                                                    {details.details.internal.examiner.name}
                                                </Typography>
                                                <Typography variant='caption' color='textSecondary'  className={classes.wrapText}>
                                                    {details.details.internal.examiner.ugpc_details.designation}
                                                </Typography>
                                            </Container>
                                        </div>
                                        <div className={detailsClasses.detailsContent}>
                                            <Typography variant='subtitle2'>
                                                External
                                            </Typography>
                                            <Container>
                                                <Typography variant='body2' style={{textTransform:"capitalize"}} className={classes.wrapText}>
                                                    {details.details.external.examiner.name}
                                                </Typography>
                                                <Typography variant='caption' color='textSecondary'  className={classes.wrapText}>
                                                    {details.details.external.examiner.ugpc_details.designation}
                                                </Typography>
                                            </Container>
                                        </div>
                                    </Container>
                                </div>
                                <div className={detailsClasses.detailsContent}>
                                    <Typography variant='subtitle2'>
                                        Supervisor
                                    </Typography>
                                    <Container>
                                        <Typography variant='body2' style={{textTransform:"capitalize"}} className={classes.wrapText}>
                                            {details.details.supervisor.name}
                                        </Typography>
                                        <Typography variant='caption' color='textSecondary'  className={classes.wrapText}>
                                            {details.details.supervisor.supervisor_details.position}
                                        </Typography>
                                    </Container>
                                </div>

                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setOpenDetails(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            }

        </ChairmanOfficeLayout>
    );
};

export default withChairmanOfficeAuthSync(Completed);