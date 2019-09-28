import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    resetButton: {
        marginRight: theme.spacing(1),
    },
    content:{
        marginBottom:theme.spacing(2)
    },
    actions:{
        display:'flex',
        justifyContent:'flex-end'
    },
    button:{
        borderRadius:0
    }
}));

const HorizontalStepper = ({activeStep,getStepContent,handleReset,handleNext,handleSubmit,steps,handleCancel}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                <div className={classes.content}>
                    {getStepContent(activeStep)}
                </div>

                <div className={classes.actions}>
                    {
                        activeStep === (steps.length - 1) &&
                        <Button onClick={handleReset} className={classes.resetButton}>
                            Reset
                        </Button>
                    }
                    <Button onClick={handleCancel} className={classes.resetButton}>
                        Cancel
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default HorizontalStepper;