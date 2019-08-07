import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper,
    Typography,
    TextField,
    Collapse,
    List,
    ListItemIcon,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Grid, Container, LinearProgress, CircularProgress
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
    },
    stepColor:{
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    formControl:{
        marginTop: theme.spacing(2)
    },
    group:{
        display:'flex',
        flexDirection:'row',
    }
}));

const getSteps =()=> {
    return ['Basic', 'Details', 'Create Project'];
};


 const CreateProject =()=> {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
     const [open, setOpen] = React.useState(false);

    const steps = getSteps();
     const [value, setValue] = React.useState('');

     const handleChange = (event)=> {
         setValue(event.target.value);
     }
    const handleNext = ()=> {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () =>{
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset= () => {
        setActiveStep(0);
    };


     const handleClick=()=> {
         setOpen(!open);
     }

     const getStepContent = step => {
         switch (step) {
             case 0:
                 return (
                     <Grid container spacing={1}>
                         <Grid xs={12} sm={10} md={8}>
                             <TextField variant='outlined' label='Title' fullWidth name='title' placeholder='Enter Your Project Title here' required/>
                         </Grid>
                     </Grid>
                 );
             case 1:
                 return (
                     <Grid container spacing={1}>
                         <Grid xs={12} sm={10} md={8}>
                         <TextField variant='outlined'
                                    label='Description'
                                    fullWidth
                                    name='description'
                                    placeholder='Your Project description here'
                                    multiline
                                    rows={4}
                                    required
                         />
                         </Grid>
                         <Grid xs={12} sm={10} md={8}>
                             <FormControl component="fieldset" className={classes.formControl}>
                                 <FormLabel component="legend">Team</FormLabel>
                                 <RadioGroup
                                     aria-label="Mode"
                                     name="mode"
                                     className={classes.group}
                                     value={value}
                                     onChange={handleChange}
                                 >
                                     <FormControlLabel value="solo" control={<Radio />} label="Solo" />
                                     <FormControlLabel value="due" control={<Radio />} label="Due" />

                                 </RadioGroup>
                             </FormControl>
                         </Grid>
                         {
                             value==='due' && <Grid xs={12} sm={10} md={8}>
                                 <List>
                                     <ListItem button onClick={handleClick}>
                                         <ListItemText primary="Choose Partner" />
                                         {open ? <ExpandLess /> : <ExpandMore />}
                                     </ListItem>
                                     <Collapse in={open} timeout="auto" unmountOnExit>
                                         <List component="div" disablePadding>
                                             <ListItem alignItems="flex-start">
                                                 <ListItemAvatar>
                                                     <Avatar alt="Travis Howard" src="/static/images/avatar/iiui-logo.jpg" />
                                                 </ListItemAvatar>
                                                 <ListItemText
                                                     primary="Partner Name"
                                                     secondary={
                                                         <React.Fragment>
                                                             <Typography
                                                                 component="span"
                                                                 variant="body2"
                                                                 className={classes.inline}
                                                                 color="textPrimary"
                                                             >
                                                                 Registration No
                                                             </Typography>
                                                             {" — email"}
                                                         </React.Fragment>
                                                     }
                                                 />
                                             </ListItem>
                                         </List>
                                     </Collapse>
                                 </List>
                             </Grid>
                         }


                     </Grid>

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
                                        onClick={handleNext}
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
            {activeStep === steps.length && (
                <CircularProgress color='secondary' />
            )}
        </div>
    );
}

export default CreateProject