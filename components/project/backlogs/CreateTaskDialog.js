import React, {useContext,Fragment, useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Grid,
    Typography,
    TextField,
    Chip,
    Avatar,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Divider
} from "@material-ui/core";
import {Done,Close, Add} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import ProjectContext from '../../../context/project/project-context';
import {isTaskValid} from "../../../utils/clientSideValidators/createTaskValidator";
import {isAuthenticated} from "../../../auth";
import RenderSubTasks from "./RenderSubTasks";
const useStyles = makeStyles(theme =>({
    content:{
        marginBottom:theme.spacing(2)
    },
    subTasksHeader:{
        display:'flex',
        alignItems:'center'
    },
    subTasksContainer:{
        border:'1px solid lightgrey',
        borderRadius:5,
        height:200,
        overflow:'hidden',
        padding:theme.spacing(1.2)
    },
}))
const CreateTaskDialog = ({openCreateTask,handleCreateTaskClose}) => {
    const classes = useStyles();
    const projectContext = useContext(ProjectContext);
    const [state,setState] = useState({
        title:'',
        description:'',
        assignee:[],
        priority:'3',
        storyPoints:'',
        subTasks:[]
    });
    const [error,setError] = useState({
        title:{
            show:false,
            message:''
        },
        description:{
            show:false,
            message:''
        },
        assignee:{
            show:false,
            message:''
        },
        storyPoints:{
            show:false,
            message:''
        },
        subTask:{
            title:{
                show:false,
                message:''
            },
            description:{
                show:false,
                message:''
            },
        }
    })
    const [subTask,setSubTask] = useState({
        title:'',
        description:'',
        status:'Not Completed'
    })
    const [showSubTaskInput,setShowSubTaskInput] = useState(false)
    const handleClickChip = id => {
        setError({
            ...error,
            assignee:{
                show:false,
                message:''
            }
        })
        if(state.assignee.includes(id)){
            setState({
                ...state,
                assignee: state.assignee.filter(student => student !== id)
            })
        }else {
            setState({
                ...state,
                assignee:[...state.assignee, id]
            })
        }
    };
    const handleSubTaskChange = event =>{
        setSubTask({
            ...subTask,
            [event.target.name]:event.target.value
        })
    };
    const handleSubTaskDialogClose = ()=>{
        setShowSubTaskInput(false)
    };
    const handleChange = event => {
        if (event.target.name === 'storyPoints' && !event.target.value.match(/^[0-9]*$/)){
            setError({
                ...error,
                storyPoints:{
                    show:true,
                    message:'Only Numbers are allowed'
                }
            })
        }else {
            setError({
                ...error,
                title:{
                    show:false,
                    message:''
                },
                description:{
                    show:false,
                    message:''
                },
                assignee:{
                    show:false,
                    message:''
                },
                storyPoints:{
                    show:false,
                    message:''
                },
            })
            setState({
                ...state,
                [event.target.name]:event.target.value
            })
        }

    };
    const addSubTask = ()=>{
        setState({
            ...state,
            subTasks:[...state.subTasks,subTask]
        });
        setShowSubTaskInput(false)
    };
    const handleCreateTask = ()=>{

        if(isTaskValid(state,error,setError)){
            const data = {
                ...state,
                createdBy:isAuthenticated().user._id
            }
            projectContext.addTaskToBacklog(projectContext.project.project[0]._id,data)
                .then(result =>{
                    handleCreateTaskClose()
                })
        }

    };

    return (
        <Dialog
            open={openCreateTask}
            onClose={handleCreateTaskClose}
            fullWidth
            maxWidth='sm'

            aria-labelledby="title"
        >
            <DialogTitle id='title'>Create New Task</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.content}>
                            <TextField
                                label='Title'
                                margin='dense'
                                variant='outlined'
                                fullWidth
                                required
                                name='title'
                                value={state.title}
                                onChange={handleChange}
                                error={error.title.show}
                                helperText={error.title.message}
                                />
                            <TextField
                                label='Detailed Description'
                                margin='dense'
                                multiline
                                fullWidth
                                rows={5}
                                variant='outlined'
                                required
                                name='description'
                                value={state.description}
                                onChange={handleChange}
                                error={error.description.show}
                                helperText={error.description.message}
                            />

                        </div>
                        <div className={classes.content}>
                            <Typography variant='body1'>
                                Assignee
                            </Typography>
                            {
                                projectContext.project.project[0].students.map((student) => (
                                    <Fragment key={student._id}>
                                    <Tooltip title={student.student_details.regNo} placement='right'>
                                        <Chip
                                            avatar={<Avatar >{student.name.charAt(0).toUpperCase()}</Avatar>}
                                            label={student.name}
                                            onClick={()=>handleClickChip(student._id)}
                                            onDelete={()=>handleClickChip(student._id)}
                                            color={state.assignee.includes(student._id) ? 'secondary':'primary'}
                                            deleteIcon={state.assignee.includes(student._id) ?<Close/> :<Done />}
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                        {error.assignee.show && <Typography variant='caption' color='error'>{error.assignee.message}</Typography>}
                                    </Fragment>
                                ))
                            }
                        </div>
                        <div className={classes.content}>
                            <FormControl fullWidth variant="outlined" margin='dense'>
                                <InputLabel htmlFor="priority">
                                    Priority
                                </InputLabel>
                                <Select

                                    value={state.priority}
                                    onChange={handleChange}
                                    input={<OutlinedInput labelWidth={52} name="priority" id="priority" />}
                                >
                                    <MenuItem value='1'>Very High</MenuItem>
                                    <MenuItem value='2'>High</MenuItem>
                                    <MenuItem value='3'>Normal</MenuItem>
                                    <MenuItem value='4'>Low</MenuItem>
                                    <MenuItem value='5'>Very Low</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.content}>
                            <Tooltip title='1 Story Point = 1Hr, 8 Story Points = 1 Day' placement='top' >
                                <TextField
                                    label='Story Points'
                                    margin='dense'
                                    fullWidth
                                    required
                                    variant='outlined'
                                    placeholder='Estimated time to complete'
                                    name='storyPoints'
                                    value={state.storyPoints}
                                    onChange={handleChange}
                                    error={error.storyPoints.show}
                                    helperText={error.storyPoints.message}
                                />
                            </Tooltip>

                        </div>
                        <div className={`${classes.content} ${classes.subTasksHeader}`}>
                            <Typography variant='body1' style={{flexGrow:1}}>
                                Sub Tasks
                            </Typography>
                            <Button
                                variant='outlined'
                                size='small'
                                color='primary'
                                onClick={()=>setShowSubTaskInput(true)}
                            >
                                <Add style={{fontSize:20}}/> Add New
                            </Button>
                            <Dialog open={showSubTaskInput} onClose={handleSubTaskDialogClose}>
                                <DialogTitle>Add New SubTask</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label='Title'
                                        margin='dense'
                                        fullWidth
                                        required
                                        variant='outlined'
                                        name='title'
                                        value={subTask.title}
                                        onChange={handleSubTaskChange}
                                        error={error.subTask.title.show}
                                        helperText={error.subTask.title.message}
                                    />
                                    <TextField
                                        label='Description'
                                        margin='dense'
                                        multiline
                                        fullWidth
                                        rows={3}
                                        variant='outlined'
                                        required
                                        name='description'
                                        value={subTask.description}
                                        onChange={handleSubTaskChange}
                                        error={error.subTask.description.show}
                                        helperText={error.subTask.description.message}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button variant='contained' onClick={handleSubTaskDialogClose}>Cancel</Button>
                                    <Button variant='contained' color='secondary' onClick={addSubTask}>Add</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div className={`${classes.content} `}>
                            <RenderSubTasks subTasks={state.subTasks}/>
                        </div>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleCreateTaskClose}>Cancel</Button>
                <Button variant='contained' color='secondary' onClick={handleCreateTask}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTaskDialog;