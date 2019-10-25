import React from 'react';
import {Button, Step, StepContent, StepLabel, Stepper} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    }
}));
const StepperComponent = ({activeStep,getStepContent,handleBack,handleNext,handleSubmit,steps}) => {
    const classes = useStyles();
    return (
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
    );
};

export default StepperComponent;