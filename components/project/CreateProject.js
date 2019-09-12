import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Typography,
    TextField,
    Grid, LinearProgress,
} from '@material-ui/core';
import {isValid} from "../../utils/clientSideValidators/createProjectValidator";
import CreateProjectDetailsComponent from "./CreateProjectDetailsComponent";
import ProjectContext from '../../context/project/project-context';
import {isAuthenticated} from "../../auth";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import router from 'next/router';
import StepperComponent from "../stepper/StepperComponent";
import UserContext from '../../context/user/user-context';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    }
}));


 const CreateProject =()=> {
     const context = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
     const [value, setValue] = useState('solo');
     const [selectedIndex, setSelectedIndex] = useState();
     const [loading, setLoading] = useState(false);
     const [success,setSuccess]=useState(false)
    const [data,setData] = useState({
        groupName:'',
        description:'',
        partnerId:'',
        team:'solo'
    });
     const handleSuccess= ()=>{
         setSuccess(false);
         router.push('/student/overview')
     }
    const [errors,setErrors] = useState({
        groupName:{
            show:false,
            message:''
        },
        description:{
            show:false,
            message:''
        },
        partnerId:{
            show:false,
            message:''
        }
    });

    const handleNext = ()=> {
         if (!isValid(data, setErrors, errors,activeStep)){
             setActiveStep(prevActiveStep => prevActiveStep + 1);
         }
         else {return}

     };

     const handleBack = () =>{
         setActiveStep(prevActiveStep => prevActiveStep - 1);
     };
    const handleSubmit= e =>{
        e.preventDefault();
        setLoading(true);
        const phase = userContext.user.user.student_details.batch.slice(1,3);
        const projectData = {
            groupName:data.title,
            description:data.description,
            phase:phase>=17 ? 'Documentation':'Implementation',
            department:userContext.user.user.department,
            students:data.team === 'solo'?[
                userContext.user.user._id
            ]:[
                userContext.user.user._id,
                data.partnerId
            ]
        };
        console.log(projectData);

        context.createProject(projectData)
            .then(()=>{
                setLoading(false);
                setSuccess(true);
            })
    };
    const handleChange = e => {
        setErrors({
            ...errors,
            groupName:{
                show:false,
                message:''
            }
        });
        setData({...data, groupName: e.target.value})
    };
     const getStepContent = step => {
         switch (step) {
             case 0:
                 return (
                     <Grid container spacing={1}>
                         <Grid item xs={12} sm={10} md={8}>
                             <TextField
                                 variant='outlined'
                                 label='Title'
                                 fullWidth
                                 name='title'
                                 placeholder='Project Title here'
                                 required
                                 error={errors.groupName.show}
                                 helperText={errors.groupName.message}
                                 value={data.groupName}
                                 onChange={handleChange}

                             />
                         </Grid>
                     </Grid>
                 );
             case 1:
                 return (
                    <CreateProjectDetailsComponent
                        data={data}
                        setData={setData}
                        error={errors}
                        setErrors={setErrors}
                        value={value}
                        setValue={setValue}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    />

                 );
             case 2:
                 return (
                     <Typography variant='h6'>
                         That's All for Now
                     </Typography>
                 );
             default:
                 return 'Unknown step';
         }
     };


    return (
        <div className={classes.root}>
            {loading && <LinearProgress color='secondary'/>}
            <SuccessSnackBar open={success} message='Project Created Successfully' handleClose={handleSuccess}/>
            <StepperComponent
                activeStep={activeStep}
                getStepContent={getStepContent}
                handleBack={handleBack}
                handleNext={handleNext}
                handleSubmit={handleSubmit}
                steps={['Basic', 'Details', 'Create Project']}
            />
        </div>
    );
}

export default CreateProject