import React, {useEffect, useRef, useState} from 'react';
import {
    Container,
    Divider,
    FormControl, InputAdornment,
    InputLabel, LinearProgress,
    MenuItem,
    OutlinedInput,
    Select,
    TextField, Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog, Tooltip, IconButton, Menu, ListItemIcon
} from "@material-ui/core";
import {
    AccountBox,
    CheckCircleOutlined, Close,
    MoreVertOutlined,
    Search, NotInterested,

} from "@material-ui/icons";

import Button from "@material-ui/core/Button";
import {changeEligibility, fetchStudentsForEligibility} from "../../utils/apiCalls/programOffice";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import DialogTitleComponent from "../DialogTitleComponent";
import CircularLoading from "../loading/CircularLoading";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import {useTableStyles} from "../../src/material-styles/tableStyles";


const ListStudentsForEligibility = ({studentsList}) => {
    const classes = useListContainerStyles();
    const emptyStyles = useListItemStyles();
    const tableClasses = useTableStyles();
    const inputLabel = useRef(null);
    const [studentList,setStudentList] =useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [status, setStatus] = useState('All');
    const [changedStatus,setChangedStatus] = useState({});
    const [dialogOpen,setDialogOpen] = useState(false);
    const [students,setStudents]=useState([]);
    const [filter,setFilter] = useState([]);
    const [labelWidth, setLabelWidth] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        setStudentList(studentsList);
        setStudents(studentsList);
        setFilter(studentsList);
        setLoading(false)
    }, []);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        switch (event.target.value) {
            case 'All':
                setStudents(studentList);
                setFilter(studentList);
                break;
            case 'Pending':
                const data = studentList;
                const filter1 = data.filter(student => student.student_details.isEligible === 'Pending');
                setStudents(filter1);
                setFilter(filter1);

                break;
            case 'Not Eligible':
                const dataFilter = studentList;
                const filter2 = dataFilter.filter(student => student.student_details.isEligible === 'Not Eligible');
                setStudents(filter2);
                setFilter(filter2);
                break;
        }
    };
    const handleChangeSearch = e =>{
        const data = students;
        setFilter(e.target.value !==''? data.filter(student => student.student_details.regNo.toLowerCase().includes(e.target.value.toLowerCase())) : students)
    };
    const handleConfirm = (status,id)=>{
        setChangedStatus({status,id});
        setDialogOpen(true);
    }
    const handleChangeStatus = (newStatus) =>{
        setDialogLoading(true);
        changeEligibility(newStatus.status,newStatus.id)
            .then(res => {
                if (res.error){
                  console.log(res.error)
                }
                fetchStudentsForEligibility().then(result => {
                    setStudentList(result);
                    setStudents(result);
                    setFilter(result);
                    setDialogOpen(false);
                    setDialogLoading(false);
                })
            })

    };
    const handleClose = ()=>{
        setDialogOpen(false);
    }
    return (
        <div>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <AccountBox className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>Students</Typography>
                        </div>

                    </div>

                   <div className={classes.listHeader}>
                       <FormControl variant="outlined" margin='dense' className={classes.formControl}>
                           <InputLabel ref={inputLabel} htmlFor="status">
                               Status
                           </InputLabel>
                           <Select
                               value={status}
                               onChange={handleChange}
                               input={<OutlinedInput labelWidth={labelWidth} name="status" id="status" />}
                           >
                               <MenuItem value='All'>All</MenuItem>
                               <MenuItem value='Pending'>Pending</MenuItem>
                               <MenuItem value='Not Eligible'>Not Eligible</MenuItem>
                           </Select>
                       </FormControl>
                       <TextField
                           variant="outlined"
                           label="Search"
                           name='search'
                           margin='dense'
                           placeholder='Write Registration No'
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
                        loading ? <CircularLoading />:
                            <div className={classes.listItemContainer}>
                                <div className={tableClasses.tableWrapper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Student Name</TableCell>
                                                <TableCell align="left">Registration No</TableCell>
                                                <TableCell align="left">Department</TableCell>
                                                <TableCell align="left">Eligibility Status</TableCell>
                                                <TableCell align="left">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filter.length === 0 ?
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            <div className={emptyStyles.emptyListContainer}>
                                                                <div className={emptyStyles.emptyList}>
                                                                    No Students Found
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    :
                                                filter.map(student => (
                                                    <TableRow key={student._id} className={tableClasses.tableRow}>
                                                        <TableCell align="left">
                                                            {student.name}
                                                        </TableCell>
                                                        <TableCell align="left">{student.student_details.regNo}</TableCell>
                                                        <TableCell align="left">{student.department}</TableCell>
                                                        <TableCell align="left">{student.student_details.isEligible}</TableCell>
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
                                                                {
                                                                    student.student_details.isEligible === 'Not Eligible'?
                                                                        <MenuItem onClick={()=>handleConfirm('Eligible',student._id)}>
                                                                            <ListItemIcon>
                                                                                <CheckCircleOutlined />
                                                                            </ListItemIcon>
                                                                            <Typography variant="inherit" noWrap>
                                                                                Make Eligible
                                                                            </Typography>
                                                                        </MenuItem>
                                                                        :
                                                                        <div>
                                                                            <MenuItem onClick={()=>handleConfirm('Eligible',student._id)}>
                                                                                <ListItemIcon>
                                                                                    <CheckCircleOutlined />
                                                                                </ListItemIcon>
                                                                                <Typography variant="inherit" noWrap>
                                                                                    Eligible
                                                                                </Typography>
                                                                            </MenuItem>
                                                                            <MenuItem onClick={()=>handleConfirm('Not Eligible',student._id)}>
                                                                                <ListItemIcon>
                                                                                    <NotInterested />
                                                                                </ListItemIcon>
                                                                                <Typography variant="inherit" noWrap>
                                                                                    Not Eligible
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        </div>
                                                                }
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
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                    }

                </div>
                <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                >
                    {dialogLoading && <LinearProgress/>}
                    <DialogTitleComponent title='Confirm' handleClose={handleClose}/>
                    <DialogContent>
                        <DialogContentText >
                            Are you sure, you want to perform this action?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} >
                            Cancel
                        </Button>
                        <Button onClick={()=>handleChangeStatus(changedStatus)} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

        </div>
    );
};

export default ListStudentsForEligibility;