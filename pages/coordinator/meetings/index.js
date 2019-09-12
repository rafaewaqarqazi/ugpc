import {withCoordinatorAuthSync} from "../../../components/routers/coordinatorAuth";
import CoordinatorLayout from "../../../components/Layouts/CoordinatorLayout";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import {fetchMeetingsAPI} from "../../../utils/apiCalls/visionDocs";
import {makeStyles} from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import {useEffect, useState} from "react";
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
    const [results,setResults] = useState([])
    const [loading,setLoading] = useState(true);
    const classes = useStyles();
    const containerClasses = useListContainerStyles();
    const [meetingsDates,setMeetingsDate] = useState([])
    const [selectedDate,setSelectedDate] = useState('All');
    const [filter,setFilter] = useState([]);
    const fetchData = ()=>{
        fetchMeetingsAPI()
            .then(result =>{
                if (result.length >0 ){
                    let data = [];
                    result.map(doc => {
                        doc.projects.map(project => {
                            data = [...data, project]
                        })
                    })
                    setResults(result);
                    setMeetings(data);
                    setFilter(data);
                    console.log(result)
                    let date = [];
                    result.map(r => {
                        date = [...date, moment(r._id).format('LLL')]
                    })
                    setMeetingsDate([...date])
                }
                setLoading(false);
            })
    }
    useEffect(()=>{

       fetchData();

    },[]);
    const handleChange =(event)=> {
        setSelectedDate(event.target.value);

        let data = [];
        switch (event.target.value) {
            case 'All':
                results.map(doc => {
                    doc.projects.map(project => {
                        data = [...data, project]
                    })
                })
                setMeetings(data);
                setFilter(data);
                break;
            case event.target.value :
                results.map(doc => {
                    const date = moment(doc._id).format('LLL')
                    if (date === event.target.value){
                        doc.projects.map(project => {
                            data = [...data, project]
                        })
                    }
                })
                setMeetings(data);
                setFilter(data);
                break;
        }
    };
    const handleChangeSearch = e =>{
        const data = meetings;
        setFilter(e.target.value !==''? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : meetings)
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
                                    <InputLabel  htmlFor="status">
                                        Meeting Date
                                    </InputLabel>
                                    <Select
                                        value={selectedDate}
                                        onChange={handleChange}
                                        input={<OutlinedInput labelWidth={100} name="status" id="status" />}
                                    >
                                        <MenuItem value='All'>All</MenuItem>
                                        {
                                            meetingsDates.map((date,index) =>
                                                <MenuItem key={index} value={date}>{date}</MenuItem>
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