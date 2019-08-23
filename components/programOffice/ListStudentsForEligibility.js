import React, {useEffect, useRef, useState} from 'react';
import {
    Container,
    Divider,
    FormControl,  InputAdornment,
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
    Dialog
} from "@material-ui/core";
import {AccountBox, Search} from "@material-ui/icons";
import {red} from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/styles";

import Button from "@material-ui/core/Button";
import {changeEligibility, fetchStudentsForEligibility} from "../../utils/apiCalls/programOffice";

const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(5),
    },
    listContainer:{
        padding:theme.spacing(2,2,10,2),
        marginTop: theme.spacing(8),
        boxShadow:theme.shadows[10],
        marginBottom: theme.spacing(5)
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
        marginBottom:theme.spacing(5),
        boxShadow:theme.shadows[10],
    },
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    empty:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        marginTop:theme.spacing(2)
    },
    tableRow:{
        "&:hover":{
            boxShadow:theme.shadows[6]
        }
    },
    buttonDanger:{
        backgroundColor: red[700],
        color:theme.palette.background.paper,
        marginLeft:theme.spacing(0.5),
        "&:hover":{
            backgroundColor: red[900],
        }
    }


}));
const ListStudentsForEligibility = ({studentsList}) => {
    const classes = useStyles();
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
            <Container className={classes.container}>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <AccountBox fontSize='large'/>
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
                        loading ? <LinearProgress />:
                            <div className={classes.listItemContainer}>
                                {
                                    filter.length === 0?
                                        <div className={classes.empty}>
                                            <Typography variant='h5' color='textSecondary'>No Record Found</Typography>
                                        </div>
                                        :
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
                                                    filter.map(student => (
                                                        <TableRow key={student._id} className={classes.tableRow}>
                                                            <TableCell align="left">
                                                                {student.name}
                                                            </TableCell>
                                                            <TableCell align="left">{student.student_details.regNo}</TableCell>
                                                            <TableCell align="left">{student.department}</TableCell>
                                                            <TableCell align="left">{student.student_details.isEligible}</TableCell>
                                                            <TableCell align="left">
                                                                {
                                                                    student.student_details.isEligible === 'Not Eligible'?
                                                                        <Button variant='contained' size='small' color='secondary' onClick={()=>handleConfirm('Eligible',student._id)}>Make Eligible</Button>
                                                                        :
                                                                        <>
                                                                            <Button variant='contained' size='small' color='secondary' onClick={()=>handleConfirm('Eligible',student._id)}>Eligible</Button>
                                                                            <Button variant='contained' size='small' className={classes.buttonDanger} onClick={()=>handleConfirm('Not Eligible',student._id)}>Not Eligible</Button>
                                                                        </>
                                                                }

                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                }
                            </div>
                    }

                </div>
                <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {dialogLoading && <LinearProgress/>}
                    <DialogTitle id="alert-dialog-title">{"Confirm?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure, you want to perform this action?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={()=>handleChangeStatus(changedStatus)} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

        </div>
    );
};

export default ListStudentsForEligibility;