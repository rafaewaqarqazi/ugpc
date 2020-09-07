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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction, Dialog, Tooltip, Zoom, DialogTitle, DialogContent, DialogActions, TextField, LinearProgress
} from '@material-ui/core';
import {SettingsOutlined, ExpandMore, Edit, Delete, Add, Close} from '@material-ui/icons';
import {makeStyles} from "@material-ui/styles";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import React, {useContext, useEffect, useState} from "react";
import HorizontalStepper from "../../components/stepper/HorizontalStepper";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import UserContext from '../../context/user/user-context';
import CircularLoading from "../../components/loading/CircularLoading";
import SuccessSnackBar from "../../components/snakbars/SuccessSnackBar";
import ErrorSnackBar from "../../components/snakbars/ErrorSnackBar";
import {useDialogStyles} from "../../src/material-styles/dialogStyles";

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
  expansionPanel: {
    boxShadow: theme.shadows[0],
    backgroundColor: '#eee'
  },
  batchList: {
    maxHeight: 300,
    overflow: 'auto',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[1],
    borderRadius: 5
  },
  batchListItem: {
    '&:hover': {
      backgroundColor: '#eee',
    }
  }
}));
const Settings = () => {
  const userContext = useContext(UserContext);
  const settingsClasses = useStyles();
  const classes = useListContainerStyles();
  const dialogClasses = useDialogStyles();
  const finalStepStyle = useListItemStyles();
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [proposal, setProposal] = useState(0);
  const [supervisor, setSupervisor] = useState(0);
  const [internal, setInternal] = useState(0);
  const [external, setExternal] = useState(0);
  const [remaining, setRemaining] = useState(100);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBatchDialog, setNewBatchDialog] = useState(false);
  const [success, setSuccess] = useState({
    open: false,
    message: ''
  });
  const [errorMess, setErrorMess] = useState({
    open: false,
    message: ''
  });
  const [newBatchError, setNewBatchError] = useState({
    show: false,
    message: ''
  });
  const [chairmanNameError, setChairmanNameError] = useState({
    show: false,
    message: ''
  });
  const [committeeHeadNameError, setCommitteeHeadNameError] = useState({
    show: false,
    message: ''
  });
  const [newBatch, setNewBatch] = useState('');
  const [chairmanName, setChairmanName] = useState('');
  const [committeeHeadName, setCommitteeHeadName] = useState('');
  const [editMarks, setEditMarks] = useState(false);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    setCommitteeHeadName(userContext?.user?.user?.chairman_details?.settings?.committeeHeadName || '')
    setChairmanName(userContext?.user?.user?.chairman_details?.settings?.chairmanName || '')
  }, [userContext?.user])
  const handleChangeBatch = event => {
    setNewBatchError({
      show: false,
      message: ''
    });
    setNewBatch(event.target.value);
  };
  const handleChangeChairmanName = event => {
    setChairmanNameError({
      show: false,
      message: ''
    });
    setChairmanName(event.target.value);
  };
  const handleChangeCommitteeHeadName = event => {
    setCommitteeHeadNameError({
      show: false,
      message: ''
    });
    setCommitteeHeadName(event.target.value);
  };
  const handleNext = () => {
    setRemaining(100 - (proposal + supervisor + internal + external));
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleReset = () => {
    setProposal(0);
    setSupervisor(0);
    setInternal(0);
    setExternal(0);
    setRemaining(100);
    setActiveStep(0);
  };
  const handleSubmit = e => {
    if (remaining > 0) {
      setError(true);
      return;
    }
    const data = {
      proposal,
      supervisor,
      internal,
      external
    };
    userContext.distributeMarks(data)
      .then(result => {
        if (result.error) {
          setEditMarks(false);
          setErrorMess({
            open: true,
            message: "Couldn't add Marks!"
          });
          return
        }
        setEditMarks(false);
        setSuccess({
          open: true,
          message: 'Marks Added!'
        })
      })
  };

  const handleProposalChange = (event, newValue) => {
    setProposal(newValue);
  };
  const handleSupervisorChange = (event, value) => {
    setSupervisor(value)
  };
  const handleInternalChange = (event, value) => {
    setInternal(value);
  };
  const handleExternalChange = (event, value) => {
    setExternal(value)
  };
  const handleDefaultMarks = () => {
    setProposal(10);
    setSupervisor(10);
    setInternal(30);
    setExternal(50);
    setRemaining(0);
    setError(false);
  };
  const handleAddNewBatch = () => {
    if (!newBatch.match(/[F][0-9]{2}$/)) {
      setNewBatchError({
        show: true,
        message: 'Invalid Batch Pattern!'
      });
      return;
    }
    setLoading(true);
    userContext.addNewBatch({newBatch, userId: userContext.user.user._id})
      .then(result => {
        console.log(result)
        if (result.error) {
          setLoading(false);
          setNewBatchDialog(false);
          setNewBatch('');
          setErrorMess({
            open: true,
            message: "Couldn't add new Batch!"
          });
          return;
        }
        setLoading(false);
        setNewBatchDialog(false);
        setNewBatch('');
        setSuccess({
          open: true,
          message: 'Batch Added!'
        })
      })
  };
  const handleClickRemoveBatch = batch => {
    userContext.removeBatch({batch, userId: userContext.user.user._id})
      .then(result => {
        console.log(result)
        if (result.error) {
          setErrorMess({
            open: true,
            message: "Couldn't remove Batch!"
          });
          return;
        }
        setSuccess({
          open: true,
          message: 'Batch Removed!'
        })
      })
  };
  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div>
            <Slider valueLabelDisplay="on" aria-label="proposal slider" value={proposal}
                    marks={[{value: 0, label: '0'}, {value: remaining, label: `${remaining}`}]} name='proposal'
                    max={remaining} onChange={handleProposalChange}/>
          </div>
        );
      case 1:
        return (
          <div>
            <Slider valueLabelDisplay="on" aria-label="supervisor slider" value={supervisor}
                    marks={[{value: 0, label: '0'}, {value: remaining, label: `${remaining}`}]} name='supervisor'
                    max={remaining} onChange={handleSupervisorChange}/>
          </div>
        );
      case 2:
        return (
          <div>
            <Slider valueLabelDisplay="on" aria-label="internal slider" value={internal}
                    marks={[{value: 0, label: '0'}, {value: remaining, label: `${remaining}`}]} name='internal'
                    max={remaining} onChange={handleInternalChange}/>
          </div>
        );
      case 3:
        return (
          <div>
            <Slider valueLabelDisplay="on" aria-label="external slider" value={external}
                    marks={[{value: 0, label: '0'}, {value: remaining, label: `${remaining}`}]} name='external'
                    max={remaining} onChange={handleExternalChange}/>
          </div>
        );
      case 4:
        return (
          <div>
            {
              error &&
              <Typography style={{textAlign: "center"}} variant='caption' color='error'>Please distribute marks
                correctly or use <Button size='small' onClick={handleDefaultMarks}>Default</Button> marks
                distribution</Typography>

            }
            <div className={finalStepStyle.emptyListContainer}>
              <div className={finalStepStyle.emptyList}>
                <Typography variant='subtitle2' color='textSecondary'>Proposal: {proposal}</Typography>
                <Typography variant='subtitle2' color='textSecondary'>Supervisor: {supervisor}</Typography>
                <Typography variant='subtitle2' color='textSecondary'>Internal: {internal}</Typography>
                <Typography variant='subtitle2' color='textSecondary'>External: {external}</Typography>
                <Typography variant='subtitle2'
                            color='textSecondary'> Total: {proposal + supervisor + internal + external}/100</Typography>
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
 const handleSaveLetterSettings = () => {
   if (isLetterSettingsValid()) {
     userContext.changeApprovalLetterSettings({chairmanName, committeeHeadName, userId: userContext.user.user._id})
       .then(result => {
         console.log(result)
         if (result.error) {
           setErrorMess({
             open: true,
             message: "Couldn't Update Names!"
           });
           return;
         }
         setSuccess({
           open: true,
           message: 'Names Updated!'
         })
       })
       .catch(() => {
         setErrorMess({
           open: true,
           message: "Couldn't Update Names!"
         });
       })
   }
 }
 const isLetterSettingsValid = () => {
   let bool = true
   if (chairmanName.trim() === '') {
     setChairmanNameError({
       show: true,
       message: 'Required!'
     });
     bool = false
   }
   if (committeeHeadName.trim() === '') {
     setCommitteeHeadNameError({
       show: true,
       message: 'Required!'
     });
     bool = false
   }
   return bool;
 }
  return (
    <ChairmanPanelLayout>
      <SuccessSnackBar message={success.message} open={success.open}
                       handleClose={() => setSuccess({open: false, message: ''})}/>
      <ErrorSnackBar open={errorMess.open} message={errorMess.message}
                     handleSnackBar={() => setErrorMess({open: false, message: ''})}/>
      <Container>
        <div className={classes.listContainer}>
          <div className={classes.top}>
            <div className={classes.topIconBox}>
              <SettingsOutlined className={classes.headerIcon}/>
            </div>
            <div className={classes.topTitle}>
              <Typography variant='h5'>Settings</Typography>
            </div>

          </div>
          <div className={settingsClasses.root}>
            <ExpansionPanel expanded={expanded === 'marksPanel'} className={settingsClasses.expansionPanel}
                            onChange={handleChange('marksPanel')}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMore/>}
                aria-controls="marksPanelbh-content"
                id="marksPanelbh-header"
              >
                <Typography className={settingsClasses.heading}>Marks Criteria</Typography>
                <Typography className={settingsClasses.secondaryHeading}>Provide marks distributions</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {
                  !editMarks &&
                  <div style={{width: '100%'}}>
                    {
                      userContext.user.isLoading ? <CircularLoading/> :
                        <div>
                          <div style={{display: "flex", justifyContent: 'flex-end'}}>
                            <IconButton size='small' onClick={() => setEditMarks(true)}>
                              <Edit/>
                            </IconButton>
                          </div>

                          <div className={finalStepStyle.emptyListContainer}>
                            <div className={finalStepStyle.emptyList}>
                              <Typography variant='subtitle2'
                                          color='textSecondary'>Proposal: {userContext.user.user.chairman_details.settings.marksDistribution.proposal}</Typography>
                              <Typography variant='subtitle2'
                                          color='textSecondary'>Supervisor: {userContext.user.user.chairman_details.settings.marksDistribution.supervisor}</Typography>
                              <Typography variant='subtitle2'
                                          color='textSecondary'>Internal: {userContext.user.user.chairman_details.settings.marksDistribution.internal}</Typography>
                              <Typography variant='subtitle2'
                                          color='textSecondary'>External: {userContext.user.user.chairman_details.settings.marksDistribution.external}</Typography>
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
                    handleCancel={() => setEditMarks(false)}
                    steps={['Proposal', 'Supervisor', 'Internal', 'External', 'Finalize']}
                  />
                }

              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'batchPanel'} className={settingsClasses.expansionPanel}
                            onChange={handleChange('batchPanel')}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMore/>}
                aria-controls="batchPanelbh-content"
                id="batchPanelbh-header"
              >
                <Typography className={settingsClasses.heading}>Batches</Typography>
                <Typography className={settingsClasses.secondaryHeading}>Add new Batches</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={settingsClasses.root}>
                  {
                    userContext.user.isLoading ? <CircularLoading/> :
                      <div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <Button color='primary' startIcon={<Add/>} onClick={() => setNewBatchDialog(true)}>Add
                            New</Button>
                        </div>
                        {
                          !userContext.user.user.chairman_details.settings.batches ||
                          userContext.user.user.chairman_details.settings.batches.length === 0 ?
                            <div className={finalStepStyle.emptyListContainer}>
                              <div className={finalStepStyle.emptyList}>
                                No Batches
                              </div>
                            </div>
                            :
                            <List className={settingsClasses.batchList}>
                              {
                                userContext.user.user.chairman_details.settings.batches.sort((a, b) => a.slice(1, 3) - b.slice(1, 3)).map((batch, index) =>
                                  <ListItem key={index} className={settingsClasses.batchListItem}>
                                    <ListItemText
                                      primary={batch}
                                    />
                                    <ListItemSecondaryAction>
                                      <Tooltip title='Remove Batch' placement="top" TransitionComponent={Zoom}>
                                        <IconButton edge="end" aria-label="delete"
                                                    onClick={() => handleClickRemoveBatch(batch)}>
                                          <Delete/>
                                        </IconButton>
                                      </Tooltip>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                )
                              }

                            </List>

                        }
                      </div>
                  }
                </div>

              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'letter'} className={settingsClasses.expansionPanel}
                            onChange={handleChange('letter')}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMore/>}
                aria-controls="letterbh-content"
                id="letterbh-header"
              >
                <Typography className={settingsClasses.heading}>Letter</Typography>
                <Typography className={settingsClasses.secondaryHeading}>Approval Letter Settings</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={settingsClasses.root}>
                  {
                    userContext.user.isLoading ? <CircularLoading/> :
                      <div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <Button color='primary' disabled={chairmanName.trim() === '' && committeeHeadName.trim() === ''} onClick={handleSaveLetterSettings}>
                            Save
                          </Button>
                        </div>
                        {/*{*/}
                        {/*  !userContext.user.user.chairman_details.settings.batches ||*/}
                        {/*  userContext.user.user.chairman_details.settings.batches.length === 0 ?*/}
                        {/*}*/}
                        <Container maxWidth='sm'>
                          <TextField
                            label='Chairman name'
                            fullWidth
                            variant='outlined'
                            value={chairmanName}
                            onChange={handleChangeChairmanName}
                            error={chairmanNameError.show}
                            helperText={chairmanNameError.message}
                            style={{marginBottom: 10}}
                          />
                          <TextField
                            label='Committee Head Name'
                            fullWidth
                            variant='outlined'
                            value={committeeHeadName}
                            onChange={handleChangeCommitteeHeadName}
                            error={committeeHeadNameError.show}
                            helperText={committeeHeadNameError.message}
                          />
                        </Container>

                      </div>
                  }
                </div>

              </ExpansionPanelDetails>
            </ExpansionPanel>
            <Divider/>
          </div>
        </div>
      </Container>
      <Dialog fullWidth maxWidth='xs' open={newBatchDialog} onClose={() => setNewBatchDialog(false)}
              classes={{paper: dialogClasses.root}}>
        {loading && <LinearProgress/>}
        <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
          <Typography variant='h6' noWrap style={{flexGrow: 1}}>Add New Batch</Typography>
          <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
            <IconButton size='small' onClick={() => setNewBatchDialog(false)}>
              <Close/>
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label='Batch'
            fullWidth
            variant='outlined'
            value={newBatch}
            onChange={handleChangeBatch}
            error={newBatchError.show}
            helperText={newBatchError.message}
            placeholder='F16'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewBatchDialog(false)}>Cancel</Button>
          <Button color='primary' onClick={handleAddNewBatch}>Add</Button>
        </DialogActions>
      </Dialog>
    </ChairmanPanelLayout>
  );
};

export default withChairmanAuthSync(Settings);
