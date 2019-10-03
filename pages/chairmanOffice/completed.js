import {useEffect, useState} from 'react';
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import ChairmanOfficeLayout from "../../components/Layouts/chairmanOfficeLayout";
import {withChairmanOfficeAuthSync} from "../../components/routers/chairmanOfficeAuth";
import {
    Container, Divider,
    FormControl, InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import {AssignmentOutlined, Search} from "@material-ui/icons";

const Completed = () => {
    const classes = useListContainerStyles();
    const [status, setStatus] = useState('All');
    const [documents,setDocuments]=useState([]);
    const [filter,setFilter] = useState([]);
    useEffect(() =>{
        // let data = [];
        // docs.map(doc => {
        //     doc.projects.map(project => {
        //         data = [...data, project]
        //     })
        // });
        // setDocuments(data);
        // setFilter(data);
    }, []);
    const handleChange =(event)=> {
        setStatus(event.target.value);
        // let data = [];
        // switch (event.target.value) {
        //     case 'All':
        //         docs.map(doc => {
        //             doc.projects.map(project => {
        //                 data = [...data, project]
        //             })
        //         })
        //         setDocuments(data);
        //         setFilter(data);
        //         break;
        //     case event.target.value :
        //         docs.map(doc => {
        //             if (doc._id.status === event.target.value){
        //                 doc.projects.map(project => {
        //                     data = [...data, project]
        //                 })
        //             }
        //         })
        //         setDocuments(data);
        //         setFilter(data);
        //         break;
        // }
    };
    const handleChangeSearch = e =>{
        // const data = documents;
        // setFilter(e.target.value !==''? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : documents)
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

                    </div>
                </div>
            </Container>
        </ChairmanOfficeLayout>
    );
};

export default withChairmanOfficeAuthSync(Completed);