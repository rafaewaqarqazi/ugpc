import React, {useState, useEffect, useRef} from 'react';
import {makeStyles} from "@material-ui/styles";
import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput, TextField,
    InputAdornment,
} from "@material-ui/core";
import {Assignment, Search} from '@material-ui/icons';
import {useListContainerStyles} from "../../../../src/material-styles/listContainerStyles";
import VisionDocListItem from "./VisionDocListItem";
import Typography from "@material-ui/core/Typography";
import {useTheme} from "@material-ui/styles";

const ListVisionDocs = ({docs}) => {
    const theme = useTheme();
    const classes = useListContainerStyles();
    const [status, setStatus] = useState('All');
    const [documents,setDocuments]=useState([]);
    const [filter,setFilter] = useState([]);
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        const data = [
            ...docs.waiting,
            ...docs.approvedForMeeting,
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
                    ...docs.approvedForMeeting,
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
            case 'Approved for Meeting':
                data =[
                    ...docs.approvedForMeeting,
                ];
                setDocuments(data);
                setFilter(data);
                break;
            case 'Meeting Scheduled':
                data =[
                    ...docs.meetingScheduled,
                ];
                setDocuments(data);
                setFilter(data);
                break;
            case 'Approved with Changes':
                data =[
                    ...docs.approvedWithChanges,
                ];
                setDocuments(data);
                setFilter(data);
                break;
            case 'Approved':
                data =[
                    ...docs.approved,
                ];
                setDocuments(data);
                setFilter(data);
                break;
            case 'Rejected':
                data =[
                    ...docs.rejected,
                ];
                setDocuments(data);
                setFilter(data);
                break;
        }
    };
    const handleChangeSearch = e =>{
        const data = documents;
        setFilter(e.target.value !==''? data.filter(doc => doc.title.toLowerCase().includes(e.target.value.toLowerCase())) : documents)
    };

    return (
        <div className={classes.listContainer}>
            <div className={classes.top}>
                <div className={classes.topIconBox}>
                    <Assignment className={classes.headerIcon}/>
                </div>
                <div className={classes.topTitle} >
                    <Typography variant='h5'>Vision Documents</Typography>
                </div>

            </div>
            <div >
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
                            <MenuItem value='Waiting for Initial Approval'>Waiting for Initial Approval</MenuItem>
                            <MenuItem value='Approved for Meeting'>Approved for Meeting</MenuItem>
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
                <VisionDocListItem
                    filter={filter}
                    inputLabel={inputLabel}
                    labelWidth={labelWidth}
                />
            </div>
        </div>

    );
};

export default ListVisionDocs;