import React, {Fragment, useState} from 'react';
import {
  Avatar,
  Chip, Collapse,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel,
  IconButton, LinearProgress, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip, Typography,
  Zoom
} from "@material-ui/core";
import moment from "moment";
import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "../../src/material-styles/randomColors";
import {
  Close,
  MoreVertOutlined,
  AccessTimeOutlined, ExpandLess, ExpandMore,
} from "@material-ui/icons";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import Button from "@material-ui/core/Button";
import SchedulingDialogContent from "../coordinator/presentations/SchedulingDialogContent";
import {
  assignExternalAutoAPI,
  assignExternalManualAPI, fetchExaminersAPI,
  fetchInternalExaminersAPI,
  scheduleInternalAutoAPI,
  scheduleInternalManualAPI
} from "../../utils/apiCalls/projects";
import {changeFinalDocumentationStatusAPI} from "../../utils/apiCalls/users";
import ErrorSnackBar from "../snakbars/ErrorSnackBar";
import {getGrade} from "../../utils";
import {getEvaluationListBorderColor, getGradeChipColor} from "../../src/material-styles/visionDocsListBorderColor";
import {useDialogStyles} from "../../src/material-styles/dialogStyles";
import CircularLoading from "../loading/CircularLoading";
import {useDocDetailsDialogStyles} from "../../src/material-styles/docDetailsDialogStyles";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import DialogTitleComponent from "../DialogTitleComponent";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";

const useStyles = makeStyles(theme => ({
  tableRow: {
    "&:hover": {

      boxShadow: theme.shadows[6]
    }
  },
  avatar: {
    width: 30,
    height: 30,
    backgroundColor: getRandomColor(),
    fontSize: 18
  },
  tableWrapper: {
    padding: theme.spacing(0.5),
    overflow: 'auto',
    maxHeight: 450
  }
}));
const ListEvaluationProjects = ({filter, fetchData}) => {
  const projectsClasses = useStyles();
  const detailsClasses = useDocDetailsDialogStyles();
  const classes = useListContainerStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [venue, setVenue] = useState('Seminar Room');
  const [selectedDate, handleDateChange] = useState(new Date());
  const [documentId, setDocumentId] = useState('');
  const [openError, setOpenError] = useState(false);
  const emptyStyles = useListItemStyles();
  const dialogClasses = useDialogStyles();
  const [data, setData] = useState({
    status: '',
    projectId: '',
    filename: '',
    originalname: '',
    title: '',
    supervisorId: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [autoAssignInternal, setAutoAssignInternal] = useState(true);
  const [internals, setInternals] = useState([]);
  const [selectedInternalId, setSelectedInternalId] = useState('');
  const [openInternalsList, setOpenInternalsList] = useState(true);
  const [autoAssignExternal, setAutoAssignExternal] = useState(true);
  const [examiners, setExaminers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedExaminerId, setSelectedExaminerId] = useState('');
  const [openExaminersList, setOpenExaminersList] = useState(true);
  const [error, setError] = useState(false);
  const [dialog, setDialog] = useState({
    details: false,
    InternalAssign: false,
    externalAssign: false
  });
  const [loading, setLoading] = useState({
    main: true,
    internals: true,
    confirm: false,
    externals: false
  });
  const [resError, setResError] = useState({
    open: false,
    message: ''
  });
  const [success, setSuccess] = useState({
    open: false,
    message: ''
  });
  const handleOpenDialog = () => {
    setOpenDialog(true)
  };
  const handleIntnernalsSwitch = event => {
    setAutoAssignInternal(event.target.checked);
    if (!event.target.checked) {
      setLoading({...loading, internals: true});
      fetchInternalExaminersAPI(data.supervisorId)
          .then(result => {
            setLoading({...loading, internals: false});
            setInternals(result);
          })
    }
  };
  const handleListItemClick = index => {
    setError(false);
    setSelectedIndex(index);
    setSelectedInternalId(internals[index]._id)
  };
  const handleInternalSchedule = () => {
    const statusData = {
      projectId: data.projectId,
      status: 'Internal Scheduled',
      documentId
    };
    if (!autoAssignInternal) {
      if (selectedInternalId === '') {
        setError(true);
        return
      } else {
        setLoading(true);
        const sData = {
          venue,
          selectedDate,
          examinerId: selectedInternalId,
          ...data
        };
        scheduleInternalManualAPI(sData)
            .then(result => {
              if (result.error) {
                setLoading(false);

                setOpenDialog(false);
                setOpenError(true);
                return
              } else {
                changeFinalDocumentationStatusAPI(statusData)
                    .then(res => {
                      setLoading(false);

                      setOpenDialog(false);
                      fetchData();
                    })
              }
            })
      }
    } else {
      const sData = {
        venue,
        selectedDate,
        ...data
      };
      scheduleInternalAutoAPI(sData)
          .then(result => {
            if (result.error) {
              setLoading(false);

              setOpenDialog(false);
              setOpenError(true);
              return
            } else {
              changeFinalDocumentationStatusAPI(statusData)
                  .then(res => {
                    setLoading(false);

                    setOpenDialog(false);
                    fetchData();
                  })
            }

          })
    }
  };
  const handleClickActionMenu = (status, projectId, supervisorId, filename, originalname, title, docId, event) => {
    setLoading(false);
    setData({
      status,
      projectId,
      filename,
      originalname,
      title,
      supervisorId
    });
    setDocumentId(docId);
    setAnchorEl(event.currentTarget);
  }
  const handleExternalAssign = () => {
    if (!autoAssignExternal) {
      if (selectedExaminerId === '') {
        setError(true);
        return
      } else {
        setLoading({
          ...loading,
          confirm: true
        });
        const sdata = {
          projectId: data.projectId,
          originalname: data.originalname,
          filename: data.filename,
          title: data.title,
          examinerId: selectedExaminerId,

        };
        assignExternalManualAPI(sdata)
          .then(result => {
            if (result.error) {
              setLoading({
                ...loading,
                confirm: false
              });
              setResError({
                open: true,
                message: result.error
              });
              return;
            } else {
              const statusData = {
                projectId: data.projectId,
                status: 'External Assigned',
                documentId
              };
              changeFinalDocumentationStatusAPI(statusData)
                .then(res => {
                  setLoading({
                    ...loading,
                    internal: false
                  });

                  setDialog({
                    ...dialog,
                    externalAssign: false,
                    details: false
                  });
                  setSuccess({
                    open: true,
                    message: 'Success'
                  });
                })
            }

          })
      }
    } else {
      setLoading({
        ...loading,
        confirm: true
      });
      const sdata = {
        projectId: data.projectId,
        originalname: data.originalname,
        filename: data.filename,
        title: data.title,
        supervisorId: data.supervisorId
      };
      assignExternalAutoAPI(sdata)
        .then(result => {
          if (result.error) {
            setLoading({
              ...loading,
              confirm: false
            });
            setResError({
              open: true,
              message: result.error
            });
            return
          } else {
            const statusData = {
              projectId: data.projectId,
              status: 'External Assigned',
              documentId
            };
            changeFinalDocumentationStatusAPI(statusData)
              .then(res => {
                setLoading({
                  ...loading,
                  internal: false
                });

                setDialog({
                  ...dialog,
                  externalAssign: false,
                  details: false
                });
                setSuccess({
                  open: true,
                  message: 'Success'
                });
              })
          }

        })
    }
  };
  const handleSuccess = () => {
    setSuccess({open: false, message: ''});
    fetchData();
  };
  const handleExternalSwitch = event => {
    setAutoAssignExternal(event.target.checked);
    if (!event.target.checked) {
      setLoading({...loading, examiners: true});
      fetchExaminersAPI(data.projectId, data.supervisorId)
        .then(result => {
          setLoading({...loading, examiners: false});
          setExaminers(result);
        })
    }
  };
  const handleListItemExternalClick = index => {
    setError(false);
    setSelectedIndex(index);
    setSelectedExaminerId(examiners[index]._id)
  };
  return (
    <div>
      <SuccessSnackBar open={success.open} message={success.message} handleClose={handleSuccess}/>
      <ErrorSnackBar open={openError} handleSnackBar={() => setOpenError(false)} message={'Examiner Not Found!'}/>
      <ErrorSnackBar open={resError.open} message={resError.message}
                     handleSnackBar={() => setResError({open: false, message: ''})}/>
      {
        <div className={projectsClasses.tableWrapper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Department</TableCell>
                <TableCell align="left">Supervisor</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Internal</TableCell>
                <TableCell align="left">OnDate</TableCell>
                <TableCell align="left">External</TableCell>
                <TableCell align="left">OnDate</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {
                filter.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={10}>
                      <div className={emptyStyles.emptyListContainer}>
                        <div className={emptyStyles.emptyList}>
                          No Projects Found
                        </div>
                      </div>
                    </TableCell>

                  </TableRow>
                  :
                  filter.map((project, index) => (
                    <TableRow key={index} className={projectsClasses.tableRow}
                              style={getEvaluationListBorderColor(project.documentation.finalDocumentation.status)}>
                      <TableCell align="left">{project.documentation.visionDocument.title}</TableCell>
                      <TableCell>{project.department}</TableCell>
                      <Tooltip title={(project.details.supervisor.supervisor_details && project.details.supervisor.supervisor_details.position) || 'Not Provided'} placement="top"
                               TransitionComponent={Zoom}>
                        <TableCell align="left"
                                   style={{textTransform: 'capitalize'}}>{project.details.supervisor.name}</TableCell>
                      </Tooltip>
                      <TableCell align="left">{project.documentation.finalDocumentation.status}</TableCell>
                      <Tooltip
                        title={project.details.internal && project.details.internal.examiner ? project.details.internal.examiner.ugpc_details.designation ? project.details.internal.examiner.ugpc_details.designation : 'Not Provided' : 'Not Assigned'}
                        placement="top" TransitionComponent={Zoom}>
                        <TableCell
                          align="left">{project.details.internal && project.details.internal.examiner ? project.details.internal.examiner.name : 'Not Assigned'}</TableCell>
                      </Tooltip>
                      <TableCell
                        align="left">{project.details.internal && project.details.internal.date ? moment(project.details.internal.date).format('MMM DD, YYYY') : 'Not Assigned'}</TableCell>
                      <Tooltip
                        title={project.details.external && project.details.external.examiner ? project.details.external.examiner.ugpc_details.designation ? project.details.external.examiner.ugpc_details.designation : 'Not Provided' : 'Not Assigned'}
                        placement="top" TransitionComponent={Zoom}>
                        <TableCell
                          align="left">{project.details.external && project.details.external.examiner ? project.details.external.examiner.name : 'Not Assigned'}</TableCell>
                      </Tooltip>
                      <TableCell
                        align="left">{project.details.external && project.details.external.date ? moment(project.details.external.date).format('MMM DD, YYYY') : 'Not Assigned'}</TableCell>
                      <TableCell align="left">{project.documentation.finalDocumentation.status === 'Completed' ?
                        <Chip label={getGrade(project.details.marks)}
                              style={getGradeChipColor(getGrade(project.details.marks))}
                              size="small"/> : 'Not Specified'}</TableCell>
                      <TableCell align="left">
                        <Tooltip title='Click for Actions' placement='top'>
                          <IconButton size='small'
                                      onClick={(event) => handleClickActionMenu(project.documentation.finalDocumentation.status, project._id, project.details.supervisor._id, project.documentation.finalDocumentation.document.filename, project.documentation.finalDocumentation.document.originalname, project.documentation.visionDocument.title, project.documentation.finalDocumentation._id, event)}>
                            <MoreVertOutlined/>
                          </IconButton>
                        </Tooltip>
                        {
                          data &&
                          <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                          >
                            {
                              data.status === 'Available for Internal' &&
                              <MenuItem onClick={handleOpenDialog}>
                                <ListItemIcon>
                                  <AccessTimeOutlined/>
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                  Schedule Internal
                                </Typography>
                              </MenuItem>
                            }
                            {
                              data.status === 'Available for External' &&
                              <MenuItem onClick={() => setDialog({...dialog, externalAssign: true})}>
                                <ListItemIcon>
                                  <AccessTimeOutlined/>
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                  Assign External
                                </Typography>
                              </MenuItem>
                            }

                            <MenuItem onClick={() => setAnchorEl(null)}>
                              <ListItemIcon>
                                <Close/>
                              </ListItemIcon>
                              <Typography variant="inherit" noWrap>
                                Cancel
                              </Typography>
                            </MenuItem>

                          </Menu>
                        }

                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </div>
      }

      {/*Internal Dialog*/}
      <Dialog fullWidth maxWidth='sm' open={openDialog} onClose={() => setOpenDialog(false)}
              classes={{paper: dialogClasses.root}}>
        <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
          <Typography variant='h6' noWrap style={{flexGrow: 1}}>Schedule Internal</Typography>
          <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
            <IconButton size='small' onClick={() => setOpenDialog(false)}>
              <Close/>
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <SchedulingDialogContent
            venue={venue}
            handleDateChange={handleDateChange}
            selectedDate={selectedDate}
            setVenue={setVenue}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Auto Assign Internal Examiner?</FormLabel>
            <FormControlLabel
                control={<Switch checked={autoAssignInternal} onChange={handleIntnernalsSwitch}
                                 value={autoAssignInternal ? 'Yes' : 'No'}/>}
                label={autoAssignInternal ? 'Yes' : 'No'}
            />
          </FormControl>
          {
            !autoAssignInternal &&
            <div>
              {
                loading.internals ? <CircularLoading/> :
                    <div>
                      {
                        error && <Typography variant='caption' color='error'>Please Select Examiner!</Typography>
                      }
                      <List>
                        <ListItem button onClick={() => setOpenInternalsList(!openInternalsList)}>
                          <ListItemText primary="Choose Supervisor"/>
                          {openInternalsList ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openInternalsList} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding className={classes.root}>
                            {
                              internals.length === 0 ?
                                  <ListItem>
                                    <Typography variant='h5' style={{textAlign: "center"}}>No Examiner Found</Typography>
                                  </ListItem>
                                  :
                                  internals.map((internal, index) => (
                                      <Fragment key={index}>
                                        <ListItem alignItems="flex-start"
                                                  selected={selectedIndex === index}
                                                  onClick={() => handleListItemClick(index)}
                                        >
                                          <ListItemAvatar>
                                            <Avatar
                                                className={detailsClasses.avatar}>{internal.name.charAt(0)}</Avatar>
                                          </ListItemAvatar>
                                          <ListItemText
                                              primary={internal.name}
                                              secondary={
                                                <React.Fragment>
                                                  <Typography
                                                      component="span"
                                                      variant="overline"
                                                      color="textPrimary"
                                                  >
                                                    {internal.ugpc_details.designation || 'Not Provided'}
                                                  </Typography>

                                                  {` — ${internal.email}`}
                                                </React.Fragment>
                                              }
                                          />
                                          <ListItemText
                                              primary={
                                                <Typography variant='subtitle2'>Projects Count</Typography>
                                              }
                                              secondary={
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    style={{textAlign: 'center'}}
                                                >
                                                  {internal.projectsCount}
                                                </Typography>

                                              }
                                          />
                                        </ListItem>
                                        <Divider variant="inset" component="li"/>
                                      </Fragment>
                                  ))}

                          </List>
                        </Collapse>
                      </List>
                    </div>
              }
            </div>
          }

        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant='outlined' color='secondary' onClick={handleInternalSchedule}>Confirm</Button>
          </DialogActions>
        </DialogActions>
      </Dialog>

      {/* External Assigning */}
      <Dialog open={dialog.externalAssign} onClose={() => setDialog({...dialog, externalAssign: false})} fullWidth
              maxWidth='sm' classes={{paper: dialogClasses.root}}>
        {loading.confirm && <LinearProgress/>}
        <DialogTitleComponent title={'External Assign'} handleClose={() => setDialog({...dialog, externalAssign: false})}/>
        <DialogContent dividers>
          <FormControl component="fieldset">
            <FormLabel component="legend">Auto Assign External Examiner?</FormLabel>
            <FormControlLabel
              control={<Switch checked={autoAssignExternal} onChange={handleExternalSwitch}
                               value={autoAssignExternal ? 'Yes' : 'No'}/>}
              label={autoAssignExternal ? 'Yes' : 'No'}
            />
          </FormControl>
          {
            !autoAssignExternal &&
            <div>
              {
                loading.examiners ? <CircularLoading/> :
                  <div>
                    {
                      error && <Typography variant='caption' color='error'>Please Select Examiner!</Typography>
                    }
                    <List>
                      <ListItem button onClick={() => setOpenExaminersList(!openExaminersList)}>
                        <ListItemText primary="Choose Examiner"/>
                        {openExaminersList ? <ExpandLess/> : <ExpandMore/>}
                      </ListItem>
                      <Collapse in={openExaminersList} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding className={classes.root}>
                          {
                            examiners.length === 0 ?
                              <ListItem>
                                <Typography variant='h5' style={{textAlign: "center"}}>No Examiner Found</Typography>
                              </ListItem>
                              :
                              examiners.map((examiner, index) => (
                                <Fragment key={index}>
                                  <ListItem alignItems="flex-start"
                                            selected={selectedIndex === index}
                                            onClick={() => handleListItemClick(index)}
                                  >
                                    <ListItemAvatar>
                                      <Avatar className={detailsClasses.avatar}>{examiner.name.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={examiner.name}
                                      secondary={
                                        <React.Fragment>
                                          <Typography
                                            component="span"
                                            variant="overline"
                                            color="textPrimary"
                                          >
                                            {examiner.ugpc_details.designation}
                                          </Typography>

                                          {` — ${examiner.email}`}
                                        </React.Fragment>
                                      }
                                    />
                                    <ListItemText
                                      primary={
                                        <Typography variant='subtitle2'>Projects Count</Typography>
                                      }
                                      secondary={
                                        <Typography
                                          variant="subtitle1"
                                          color="textPrimary"
                                        >
                                          {examiner.projectsCount}
                                        </Typography>

                                      }
                                    />
                                  </ListItem>
                                  <Divider variant="inset" component="li"/>
                                </Fragment>
                              ))}

                        </List>
                      </Collapse>
                    </List>
                  </div>
              }
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({...dialog, externalAssign: false})}>Cancel</Button>
          <Button onClick={handleExternalAssign} variant='outlined' color='secondary'>Confirm</Button>
        </DialogActions>
      </Dialog><Dialog open={dialog.externalAssign} onClose={() => setDialog({...dialog, externalAssign: false})} fullWidth
                       maxWidth='sm' classes={{paper: dialogClasses.root}}>
      {loading.confirm && <LinearProgress/>}
      <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
        <Typography variant='h6' noWrap style={{flexGrow: 1}}>Assign External Examiner</Typography>
        <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
          <IconButton size='small' onClick={() => setDialog({...dialog, externalAssign: false})}>
            <Close/>
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl component="fieldset">
          <FormLabel component="legend">Auto Assign External Examiner?</FormLabel>
          <FormControlLabel
            control={<Switch checked={autoAssignExternal} onChange={handleExternalSwitch}
                             value={autoAssignExternal ? 'Yes' : 'No'}/>}
            label={autoAssignExternal ? 'Yes' : 'No'}
          />
        </FormControl>
        {
          !autoAssignExternal &&
          <div>
            {
              loading.examiners ? <CircularLoading/> :
                <div>
                  {
                    error && <Typography variant='caption' color='error'>Please Select Examiner!</Typography>
                  }
                  <List>
                    <ListItem button onClick={() => setOpenExaminersList(!openExaminersList)}>
                      <ListItemText primary="Choose Examiner"/>
                      {openExaminersList ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openExaminersList} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding className={classes.root}>
                        {
                          examiners.length === 0 ?
                            <ListItem>
                              <Typography variant='h5' style={{textAlign: "center"}}>No Examiner Found</Typography>
                            </ListItem>
                            :
                            examiners.map((examiner, index) => (
                              <Fragment key={index}>
                                <ListItem alignItems="flex-start"
                                          selected={selectedIndex === index}
                                          onClick={() => handleListItemExternalClick(index)}
                                >
                                  <ListItemAvatar>
                                    <Avatar className={detailsClasses.avatar}>{examiner.name.charAt(0)}</Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={examiner.name}
                                    secondary={
                                      <React.Fragment>
                                        <Typography
                                          component="span"
                                          variant="overline"
                                          className={classes.inline}
                                          color="textPrimary"
                                        >
                                          {examiner.ugpc_details.designation}
                                        </Typography>

                                        {` — ${examiner.email}`}
                                      </React.Fragment>
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      <Typography variant='subtitle2'>Projects Count</Typography>
                                    }
                                    secondary={
                                      <Typography
                                        variant="subtitle1"
                                        color="textPrimary"
                                      >
                                        {examiner.projectsCount}
                                      </Typography>

                                    }
                                  />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                              </Fragment>
                            ))}

                      </List>
                    </Collapse>
                  </List>
                </div>
            }
          </div>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialog({...dialog, externalAssign: false})}>Cancel</Button>
        <Button onClick={handleExternalAssign} variant='outlined' color='secondary'>Confirm</Button>
      </DialogActions>
    </Dialog>

    </div>
  );
};

export default ListEvaluationProjects;