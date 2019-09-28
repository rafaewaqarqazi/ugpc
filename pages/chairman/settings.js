import ChairmanPanelLayout from "../../components/Layouts/ChairmanPanelLayout";
import {withChairmanAuthSync} from "../../components/routers/chairmanAuth";
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography, Container,
    Slider,
    Divider,
    Button,
    IconButton
} from '@material-ui/core';
import {SettingsOutlined, ExpandMore,Edit} from '@material-ui/icons';
import {makeStyles} from "@material-ui/styles";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import React, {useContext, useState} from "react";
import HorizontalStepper from "../../components/stepper/HorizontalStepper";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import UserContext from '../../context/user/user-context';
import CircularLoading from "../../components/loading/CircularLoading";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    expansionPanel:{
        boxShadow: theme.shadows[0],
        backgroundColor:'#eee'
    }
}));
const Settings = () => {
    const userContext = useContext(UserContext);
    const settingsClasses = useStyles();
    const classes = useListContainerStyles();
    const finalStepStyle = useListItemStyles();
    const [expanded, setExpanded] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [proposal,setProposal] = useState(0);
    const [supervisor,setSupervisor] = useState(0);
    const [internal,setInternal] = useState(0);
    const [external,setExternal] = useState(0);
    const [remaining,setRemaining] = useState(100);
    const [error,setError] = useState(false);
    const [editMarks,setEditMarks] = useState(false);
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleNext = ()=> {
        // if (!isValid(data, setErrors, errors,activeStep)){
        setRemaining(100 - (proposal + supervisor + internal + external));
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        // }
        // else {return}

    };

    const handleReset = () =>{
        setProposal(0);
        setSupervisor(0);
        setInternal(0);
        setExternal(0);
        setRemaining(100);
        setActiveStep(0);
    };
    const handleSubmit= e =>{
        if (remaining > 0){
            setError(true);
            return;
        }
        const data ={
            proposal,
            supervisor,
            internal,
            external
        };
        userContext.distributeMarks(data)
            .then(result =>{
                console.log('Allocated')
            })
    };

    const handleProposalChange = (event,newValue) =>{
        setProposal(newValue);
    };
    const handleSupervisorChange = (event,value) =>{
       setSupervisor(value)
    };
    const handleInternalChange = (event,value) =>{
        setInternal(value);
    };
    const handleExternalChange = (event,value) =>{
        setExternal(value)
    };
    const handleDefaultMarks = ()=>{
        setProposal(10);
        setSupervisor(10);
        setInternal(30);
        setExternal(50);
        setRemaining(0);
        setError(false);
    }
    const getStepContent = step => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <Slider valueLabelDisplay="on" aria-label="proposal slider" value={proposal} marks={[{value:0,label:'0'},{value:remaining,label:`${remaining}`}]} name='proposal'  max={remaining} onChange={handleProposalChange}/>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <Slider valueLabelDisplay="on" aria-label="supervisor slider" value={supervisor} marks={[{value:0,label:'0'},{value:remaining,label:`${remaining}`}]}  name='supervisor'  max={remaining} onChange={handleSupervisorChange}/>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <Slider valueLabelDisplay="on" aria-label="internal slider" value={internal} marks={[{value:0,label:'0'},{value:remaining,label:`${remaining}`}]}  name='internal' max={remaining} onChange={handleInternalChange}/>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <Slider valueLabelDisplay="on" aria-label="external slider" value={external}  marks={[{value:0,label:'0'},{value:remaining,label:`${remaining}`}]} name='external' max={remaining} onChange={handleExternalChange}/>
                    </div>
                );
            case 4:
                return (
                    <div>
                        {
                            error &&
                                <Typography style={{textAlign:"center"}} variant='caption' color='error'>Please distribute marks correctly or use <Button size='small' onClick={handleDefaultMarks}>Default</Button> marks distribution</Typography>

                        }
                        <div className={finalStepStyle.emptyListContainer}>
                            <div className={finalStepStyle.emptyList}>
                                <Typography variant='subtitle2' color='textSecondary'>Proposal: {proposal}</Typography>
                                <Typography variant='subtitle2' color='textSecondary'>Supervisor: {supervisor}</Typography>
                                <Typography variant='subtitle2' color='textSecondary'>Internal: {internal}</Typography>
                                <Typography variant='subtitle2' color='textSecondary'>External: {external}</Typography>
                                <Typography variant='subtitle2' color='textSecondary'> Total: {proposal + supervisor + internal + external}/100</Typography>
                                <Typography variant='subtitle2' color='textSecondary'>Remaining: {remaining}</Typography>
                                <Typography variant='subtitle2' color='textSecondary'>
                                    Click finish to finalize marks criteria
                                </Typography>

                            </div>
                        </div>
                    </div>

                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <ChairmanPanelLayout>
            <Container>
                <div className={classes.listContainer}>
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <SettingsOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5'>Settings</Typography>
                        </div>

                    </div>
                    <div className={settingsClasses.root}>
                        <ExpansionPanel expanded={expanded === 'marksPanel'} className={settingsClasses.expansionPanel} onChange={handleChange('marksPanel')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="marksPanelbh-content"
                                id="marksPanelbh-header"
                            >
                                <Typography className={settingsClasses.heading}>Marks Criteria</Typography>
                                <Typography className={settingsClasses.secondaryHeading}>Provide marks distributions</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                {
                                    !editMarks &&
                                        <div style={{width:'100%'}}>
                                            {
                                                userContext.user.isLoading ? <CircularLoading/> :
                                                    <div>
                                                        <div style={{display:"flex",justifyContent:'flex-end'}}>
                                                            <IconButton size='small' onClick={()=>setEditMarks(true)}>
                                                                <Edit/>
                                                            </IconButton>
                                                        </div>

                                                        <div className={finalStepStyle.emptyListContainer}>
                                                            <div className={finalStepStyle.emptyList}>
                                                                <Typography variant='subtitle2' color='textSecondary'>Proposal: {userContext.user.user.chairman_details.settings.marksDistribution.proposal}</Typography>
                                                                <Typography variant='subtitle2' color='textSecondary'>Supervisor: {userContext.user.user.chairman_details.settings.marksDistribution.supervisor}</Typography>
                                                                <Typography variant='subtitle2' color='textSecondary'>Internal: {userContext.user.user.chairman_details.settings.marksDistribution.internal}</Typography>
                                                                <Typography variant='subtitle2' color='textSecondary'>External: {userContext.user.user.chairman_details.settings.marksDistribution.external}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>

                                            }
                                        </div>
                                }

                                {
                                    editMarks &&
                                    <HorizontalStepper
                                        activeStep={activeStep}
                                        getStepContent={getStepContent}
                                        handleReset={handleReset}
                                        handleNext={handleNext}
                                        handleSubmit={handleSubmit}
                                        handleCancel={()=>setEditMarks(false)}
                                        steps={['Proposal', 'Supervisor', 'Internal', 'External','Finalize']}
                                    />
                                }

                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <Divider/>
                    </div>
                </div>
            </Container>

        </ChairmanPanelLayout>
    );
};

export default withChairmanAuthSync(Settings);