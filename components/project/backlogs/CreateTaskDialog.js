import React, {useContext,Fragment, useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
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
    MenuItem
} from "@material-ui/core";
import {Done,Close, Add} from '@material-ui/icons'
import {makeStyles} from "@material-ui/styles";
import ProjectContext from '../../../context/project/project-context';
import {isSubTaskValid, isTaskValid} from "../../../utils/clientSideValidators/createTaskValidator";
import {isAuthenticated} from "../../../auth";
import RenderSubTasks from "./RenderSubTasks";
import DialogTitleComponent from "../../DialogTitleComponent";
import {useDialogStyles} from "../../../src/material-styles/dialogStyles";
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
    const dialogClasses = useDialogStyles();
    const projectContext = useContext(ProjectContext);
    const [state,setState] = useState({
        description:'',
        assignee:[],
        priority:'3',
        storyPoints:'',
        subTasks:[]
    });
    const [error,setError] = useState({
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
    });
    const [subTask,setSubTask] = useState({
        title:'',
        description:''
    });
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
        if (isSubTaskValid(subTask,error,setError)){
            setState({
                ...state,
                subTasks:[...state.subTasks,subTask]
            });
            setShowSubTaskInput(false)
        }
    };
    const handleCreateTask = ()=>{

        if(isTaskValid(state,error,setError)){

            let taskNo = 0;
            taskNo +=projectContext.project.project.details.backlog.length;
            projectContext.project.project.details.sprint.map(sprint =>{
                const todos = sprint.tasks.filter(task => task.status === 'todo').length;
                const inProgress = sprint.tasks.filter(task => task.status === 'inProgress').length;
                const inReview = sprint.tasks.filter(task => task.status === 'inReview').length;
                const done = sprint.tasks.filter(task => task.status === 'done').length;
                if (sprint.status === 'Completed'){
                    taskNo += done
                }else {

                    taskNo += todos + inProgress + inReview + done
                }
            });
            const data = {
                ...state,
                title:`TS-${taskNo+1}`,
                createdBy:isAuthenticated().user._id,
                status:'todo'
            };
            projectContext.addTaskToBacklog(projectContext.project.project._id,data)
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
            classes={{paper: dialogClasses.root}}
            aria-labelledby="title"
        >
            <DialogTitleComponent title='Create New Task' handleClose={handleCreateTaskClose}/>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.content}>
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
                                helperText={error.description.show ? error.description.message : `${state.description.length}/1000`}
                            />

                        </div>
                        <div className={classes.content}>
                            <Typography variant='body1'>
                                Assignee
                            </Typography>
                            {
                               !projectContext.project.isLoading && projectContext.project.project.students.map((student) => (
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
                            <Dialog open={showSubTaskInput} onClose={handleSubTaskDialogClose} classes={{paper: dialogClasses.root}}>
                                <DialogTitleComponent title='Add New SubTask' handleClose={handleSubTaskDialogClose}/>
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
                                        helperText={error.subTask.title.show ? error.subTask.title.message : `${subTask.title.length}/100`}
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
                                        helperText={error.subTask.description.show ? error.subTask.description.message : `${subTask.description.length}/500`}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button variant='contained' onClick={handleSubTaskDialogClose}>Cancel</Button>
                                    <Button variant='contained' color='secondary' onClick={addSubTask}>Add</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div className={classes.content}>
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