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
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    }
}));

const getSteps =()=> {
    return ['Basic', 'Details', 'Create Project'];
};


 const CreateProject =()=> {
     const context = useContext(ProjectContext);

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
     const [value, setValue] = useState('solo');
     const [selectedIndex, setSelectedIndex] = useState();
     const [loading, setLoading] = useState(false);
     const [success,setSuccess]=useState(false)
    const [data,setData] = useState({
        title:'',
        description:'',
        partnerId:'',
        team:'solo'
    });
     const handleSuccess= ()=>{
         setSuccess(false);
         router.push('/student/overview')
     }
    const [errors,setErrors] = useState({
        title:{
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

    const steps = getSteps();



    const handleNext = ()=> {
        if (!isValid(data, setErrors, errors,activeStep)){
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
        else {return}

    };

    const handleBack = () =>{
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
    const handleSubmit=()=>{
        setLoading(true);
        const phase = isAuthenticated().user.student_details.batch.slice(1,3);
        const projectData = {
            title:data.title,
            description:data.description,
            phase:phase>=17 ? 'Documentation':'Implementation',
            students:data.team === 'solo'?[
                isAuthenticated().user._id
            ]:[
                isAuthenticated().user._id,
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
            title:{
                show:false,
                message:''
            }
        });
        setData({...data, title: e.target.value})
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
                                 error={errors.title.show}
                                 helperText={errors.title.message}
                                 value={data.title}
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
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}

export default CreateProject