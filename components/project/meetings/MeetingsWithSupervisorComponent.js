import React, {useContext, useState} from 'react';
import {
    CheckCircleOutline,
} from "@material-ui/icons";
import {
    Button, Dialog, DialogActions, DialogContent,
    IconButton, LinearProgress, Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TextField,
    Tooltip,
} from "@material-ui/core";
import moment from "moment";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import UserContext from '../../../context/user/user-context';
import DialogTitleComponent from "../../DialogTitleComponent";
import DateFnsUtils from "@date-io/date-fns";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import ProjectContext from '../../../context/project/project-context';
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {getSupervisorMeetingChipColor} from "../../../src/material-styles/visionDocsListBorderColor";

const MeetingsWithSupervisorComponent = ({meetings,role}) => {
    const userContext = useContext(UserContext);
    const projectContext = useContext(ProjectContext);
    const emptyStyles = useListItemStyles();
    const tableClasses = useTableStyles();
    const [dialog,setDialog] = useState({
        scheduleMeeting:false,
        requestMeeting:false
    });
    const [selectedDate, handleDateChange] = useState(new Date());
    const [purpose,setPurpose] = useState('');
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState({
        show:false,
        message:''
    });
    const handleScheduleMeeting = ()=>{
        const meetingData = {
            projectId:projectContext.project.project._id,
            purpose,
            selectedDate
        };
        setLoading(true);
        projectContext.scheduleSupervisorMeeting(meetingData)
            .then(result =>{
                setDialog({
                    ...dialog,
                    scheduleMeeting:false
                });
                setLoading(false);
                setSuccess({show:true,message:'Meeting Scheduled'})
            })
            .catch(err => console.error(err.message));
    };
    const handleRequestMeeting = ()=>{
        const meetingRequestData = {
            purpose,
            username:userContext.user.user.name,
            projectTitle:projectContext.project.project.documentation.visionDocument.filter(doc => doc.status === 'Approved' || doc.status === 'Approved With Changes')[0].title,
            supervisorEmail:projectContext.project.project.details.supervisor.email
        };
        setLoading(true);
        projectContext.requestSupervisorMeeting(meetingRequestData)
            .then(result =>{
                setDialog({
                    ...dialog,
                    requestMeeting:false
                });
                setLoading(false);
                setSuccess({show:true,message:'Meeting Request Sent'})
            })
            .catch(err => console.error(err.message));
    };
    const handleChangePurpose = event =>{
        setPurpose(event.target.value);
    };
    const handleMarksAsAttended = meetingId=>{
        const data = {
            projectId:projectContext.project.project._id,
            meetingId
        };
        projectContext.markSupervisorMeetingAsAttended(data)
            .then(result =>{
                setSuccess({show:true,message:'Success'})
            })
            .catch(err => console.error(err.message));
    };
    return (
        <div>
            <SuccessSnackBar open={success.show} message={success.message} handleClose={()=>setSuccess({show:false,message:''})}/>
            <div className={tableClasses.listHeader}>
                {
                    !userContext.user.isLoading && userContext.user.user.role === 'Supervisor' ?
                        <Button variant='outlined' color='primary' onClick={()=>setDialog({...dialog,scheduleMeeting:true})}>
                            Schedule Meeting
                        </Button>
                        :
                        projectContext.project.project.details.supervisor &&
                        <Button variant='outlined' color='primary' onClick={()=>setDialog({...dialog,requestMeeting:true})}>
                            Request for Meeting
                        </Button>
                }

            </div>
            <div className={tableClasses.tableWrapper}>
                <Table  size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SrNo.</TableCell>
                            <TableCell align="left">Purpose</TableCell>
                            <TableCell align="left">Date</TableCell>
                            <TableCell align="left">Attended</TableCell>
                            {
                                role === 'Supervisor' &&
                                <TableCell align="left">Actions</TableCell>
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                           !meetings || meetings.length === 0?
                                <TableRow >
                                    <TableCell colSpan={role === 'Supervisor' ? 5 : 4}>
                                        <div className={emptyStyles.emptyListContainer}>
                                            <div className={emptyStyles.emptyList}>
                                                No Meetings Found
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>:
                                meetings.map((meeting,index) => (
                                    <TableRow  key={index} className={tableClasses.tableRow} >
                                        <TableCell align="left" >{index+1}</TableCell>
                                        <TableCell align="left" >{meeting.purpose}</TableCell>

                                        <TableCell align="left" >{moment(meeting.date).format('MM/DD/YY, h:mm A')}</TableCell>

                                        <TableCell >
                                            <Chip label={meeting.isAttended ? 'Attended' : 'Not Attended'} style={getSupervisorMeetingChipColor(meeting)}/>
                                        </TableCell>
                                        {
                                            role === 'Supervisor' &&
                                            <TableCell >
                                                <Tooltip title='Mark As Attended' placement='top'>
                                                    <div>
                                                        <IconButton size='small' disabled={meeting.isAttended} onClick={()=>handleMarksAsAttended(meeting._id)}>
                                                            <CheckCircleOutline/>
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                        }

                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </div>

        <Dialog open={dialog.scheduleMeeting} onClose={()=>setDialog({...dialog,scheduleMeeting:false})} fullWidth maxWidth='xs'>
            {loading && <LinearProgress/>}
            <DialogTitleComponent title={'Schedule Meeting'} handleClose={()=>setDialog({...dialog,scheduleMeeting:false})}/>
            <DialogContent dividers>
                <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                    <TextField
                        label='Purpose'
                        fullWidth
                        autoFocus
                        variant='outlined'
                        margin='dense'
                        value={purpose}
                        required
                        onChange={handleChangePurpose}
                        />
                    <DateTimePicker
                        label="Select Date&Time"
                        inputVariant="outlined"
                        value={selectedDate}
                        onChange={handleDateChange}
                        disablePast
                        fullWidth
                        margin='dense'
                    />
                </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setDialog({...dialog,scheduleMeeting:false})}>Cancel</Button>
                <Button onClick={handleScheduleMeeting} color='primary' disabled={purpose.trim() === ''}>Schedule</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={dialog.requestMeeting} onClose={()=>setDialog({...dialog,requestMeeting:false})} fullWidth maxWidth='xs'>
            {loading && <LinearProgress/>}
            <DialogTitleComponent title={'Request for Meeting'} handleClose={()=>setDialog({...dialog,requestMeeting:false})}/>
            <DialogContent dividers>
                <TextField
                    label='Purpose'
                    required
                    fullWidth
                    autoFocus
                    variant='outlined'
                    margin='dense'
                    value={purpose}
                    onChange={handleChangePurpose}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setDialog({...dialog,requestMeeting:false})}>Cancel</Button>
                <Button onClick={handleRequestMeeting} color='primary' disabled={purpose.trim() === ''}>Request</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
};

export default MeetingsWithSupervisorComponent;