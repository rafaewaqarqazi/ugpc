import EvaluationChairmanLayout from "../../../../components/Layouts/EvaluationChairmanLayout";
import {withChairmanEvaluationAuthSync} from "../../../../components/routers/chairmanEvaluationAuth";
import {Assignment, Search} from "@material-ui/icons";
import {
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    Container
} from "@material-ui/core";
import {useListContainerStyles} from "../../../../src/material-styles/listContainerStyles";
import {useEffect, useState} from "react";
import ListEvaluationProjects from "../../../../components/project/ListEvaluationProjects";
import CircularLoading from "../../../../components/loading/CircularLoading";
import {fetchForEvaluationProjectsAPI} from "../../../../utils/apiCalls/projects";

const Index = () => {
    const classes = useListContainerStyles();
    const [status, setStatus] = useState('All');
    const [projects,setProjects]=useState([]);
    const [filter,setFilter] = useState([]);
    const [loading,setLoading] = useState(true);
    const fetchData =()=>{
        setLoading(true);
        fetchForEvaluationProjectsAPI()
            .then(result =>{
                console.log(result);
                setProjects(result);
                setStatus('All')
                setFilter(result);
                setLoading(false)
            })
    };
    useEffect(()=>{
        fetchData();
    },[]);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        switch (event.target.value) {
            case 'All':
                setFilter(projects);
                break;
            case event.target.value :
                let data = [];
                projects.map(project => {
                    if(project.documentation.finalDocumentation.status === event.target.value){
                        data=[
                            ...data,
                            project
                        ]
                    }
                });
                setFilter(data);
                break;
        }
    };
    const handleChangeSearch = e =>{
        // const data = documents;
        // setFilter(e.target.value !==''? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : documents)
    };
    return (
        <EvaluationChairmanLayout>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <Assignment className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>Projects</Typography>
                        </div>

                    </div>
                    {
                        loading ? <CircularLoading/> :
                            <div >
                                <div className={classes.listHeader}>
                                    <FormControl variant="outlined" margin='dense' className={classes.formControl}>
                                        <InputLabel htmlFor="status">
                                            Status
                                        </InputLabel>
                                        <Select
                                            value={status}
                                            onChange={handleChange}
                                            input={<OutlinedInput labelWidth={47} name="status" id="status" />}
                                        >
                                            <MenuItem value='All'>All</MenuItem>
                                            <MenuItem value='Available for Internal'>Available for Internal</MenuItem>
                                            <MenuItem value='Internal Scheduled'>Internal Scheduled</MenuItem>
                                            <MenuItem value='Available for External'>Available for External</MenuItem>
                                            <MenuItem value='External Scheduled'>External Scheduled</MenuItem>
                                            <MenuItem value='External Held'>Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        variant="outlined"
                                        label="Search"
                                        name='search'
                                        margin='dense'
                                        placeholder='Search For Projects'
                                        // onChange={handleChangeSearch}
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
                                <ListEvaluationProjects fetchData={fetchData} filter={filter.filter(f => f !== undefined)}/>
                            </div>
                    }

                </div>
            </Container>


        </EvaluationChairmanLayout>
    );
};

export default withChairmanEvaluationAuthSync(Index);