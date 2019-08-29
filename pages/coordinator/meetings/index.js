import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import {fetchMeetingsAPI} from "../../../utils/apiCalls/visionDocs";
import {makeStyles} from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import React, {useEffect, useRef, useState} from "react";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {Assignment, Search} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import {
    Divider,
    FormControl,
    InputAdornment,
    InputLabel, LinearProgress,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from "@material-ui/core";
import VisionDocListItem from "../../../components/visionDocument/higherAuthority/list/VisionDocListItem";
import moment from "moment";
const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    }
}))
const Index = () => {
    const [meetings,setMeetings] = useState([]);
    const [loading,setLoading] = useState(true);
    const classes = useStyles();
    const containerClasses = useListContainerStyles();
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [meetingsDates,setMeetingsDate] = useState([])
    const [dates,setDates] = useState('All');
    const [filter,setFilter] = useState([]);
    const fetchData = ()=>{
        fetchMeetingsAPI()
            .then(result =>{
                setMeetings(result[0].projects);
                setFilter(result[0].projects);
                console.log(result)
                setMeetingsDate([...meetingsDates, moment( Array.from(result.map(r => r._id))).format('LLL')])
                setLoading(false);
            })
    }
    useEffect(()=>{
        setLabelWidth(inputLabel.current.offsetWidth);
       fetchData()
    },[]);
    const handleChange =(event)=> {
        setDates(event.target.value);
        console.log(meetingsDates[event.target.value])
        let data = [];
        switch (event.target.value) {

        }
    };
    const handleChangeSearch = e =>{
        const data = meetings;
        setFilter(e.target.value !==''? data.filter(doc => doc.title.toLowerCase().includes(e.target.value.toLowerCase())) : meetings)
    };
    return (
        <VisionDocsState>
            <CoordinatorLayout>
                {loading && <LinearProgress />}
                <Container className={classes.container}>
                    <div className={containerClasses.listContainer}>
                        <div className={containerClasses.top}>
                            <div className={containerClasses.topIconBox}>
                                <Assignment className={containerClasses.headerIcon}/>
                            </div>
                            <div className={containerClasses.topTitle}>
                                <Typography variant='h5'>Meetings</Typography>
                            </div>

                        </div>
                        <div >
                            <div className={containerClasses.listHeader}>
                                <FormControl variant="outlined" margin='dense' className={containerClasses.formControl}>
                                    <InputLabel ref={inputLabel} htmlFor="status">
                                        Meeting Date
                                    </InputLabel>
                                    <Select
                                        value={dates}
                                        onChange={handleChange}
                                        input={<OutlinedInput labelWidth={labelWidth} name="status" id="status" />}
                                    >
                                        <MenuItem value='All'>All</MenuItem>
                                        {
                                            meetingsDates.map(date =>
                                                <MenuItem value={date}>{date}</MenuItem>
                                            )
                                        }
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
                                !loading &&
                                <VisionDocListItem
                                    filter={filter}
                                    inputLabel={inputLabel}
                                    labelWidth={labelWidth}
                                    fetchData={fetchData}
                                />
                            }

                        </div>
                    </div>
                </Container>


            </CoordinatorLayout>
        </VisionDocsState>
    );
};


export default withCoordinatorAuthSync(Index);