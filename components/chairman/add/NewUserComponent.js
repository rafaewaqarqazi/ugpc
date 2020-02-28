import React, {useState, useContext} from 'react';
import {
  Avatar, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid, IconButton,
  InputLabel,
  LinearProgress, MenuItem,
  OutlinedInput,
  Select,
  TextField, Tooltip,
  Typography, Zoom
} from "@material-ui/core";
import {Close, PersonAddOutlined} from '@material-ui/icons'
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {useSignInStyles} from "../../../src/material-styles/signin-styles";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import UserContext from '../../../context/user/user-context';
import {useDialogStyles} from "../../../src/material-styles/dialogStyles";

const NewUserComponent = ({open, onClose}) => {
  const userContext = useContext(UserContext);
  const classes = useSignInStyles();
  const dialogStyles = useDialogStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    open: false,
    message: ''
  });
  const [reject, setReject] = useState({
    open: false,
    message: ''
  });
  const [data, setData] = useState({
    name: '',
    email: '',
    role: '',
    additionalRole: 'UGPC_Member',
    designation: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    role: false,
    designation: false
  });
  const handleSuccess = () => {
    setSuccess({open: false});
  };
  const handleCloseErrorSnackbar = () => {
    setReject({open: false})
  };
  const isValid = data => {
    if (!data.email.match(/.+\@.+\..+/)) {
      setErrors({...errors, email: true})
      return false
    } else if (data.role === '') {
      setErrors({...errors, role: true})
      return false
    } else if (data.designation === '' && data.role !== 'Program_Office') {
      setErrors({...errors, designation: true});
      return false
    }
    return true
  };
  const handleSubmit = e => {
    e.preventDefault();

    if (isValid(data) && data.name.trim() !== '') {
      setLoading(true);
      userContext.createUser({...data, settings: userContext.user.user.chairman_details.settings})
        .then(res => {
          if (res.error) {
            setReject({open: true, message: res.error});
            setLoading(false);
          } else {
            setSuccess({open: true, message: res.message});
            setLoading(false);
            setData({
              name: '',
              email: '',
              role: '',
              additionalRole: 'UGPC_Member',
              designation: ''
            })
          }
        });
    }

  };
  const handleChange = e => {
    setErrors({
      ...errors,
      [e.target.name]: false
    });
    if (e.target.name === 'role' && e.target.value === 'UGPC_Member') {
      setData({...data, [e.target.name]: e.target.value, additionalRole: 'UGPC_Member'})
    } else if (e.target.name === 'role' && (e.target.value === 'Program_Office' || e.target.value === 'Chairman DCSSE')) {
      setData({...data, [e.target.name]: e.target.value, additionalRole: 'None'})
    } else {
      setData({...data, [e.target.name]: e.target.value})
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs' classes={{paper: dialogStyles.root}}>

      {loading && <LinearProgress color='secondary'/>}
      <SuccessSnackBar open={success.open} message={success.message} handleClose={handleSuccess}/>
      <ErrorSnackBar open={reject.open} message={reject.message} handleSnackBar={handleCloseErrorSnackbar}/>
      <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
        <Typography variant='h6' noWrap style={{flexGrow: 1}}>Add New User</Typography>
        <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
          <IconButton size='small' onClick={onClose}>
            <Close/>
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Avatar className={classes.avatar} style={{backgroundColor: '#009688'}}><PersonAddOutlined
              style={{width: 32, height: 32}}/></Avatar>
            <Typography variant="h5">
              User Details
            </Typography>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                label='Full Name'
                fullWidth
                name='name'
                placeholder='Write Full Name'
                required
                error={errors.name}
                helperText={errors.name ? 'Required*' : ''}
                value={data.name}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                label='Email'
                fullWidth
                name='email'
                required
                error={errors.email}
                helperText={errors.email ? 'Not Valid!' : ''}
                value={data.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={errors.role} variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="role">
                  Role
                </InputLabel>
                <Select
                  value={data.role}
                  onChange={handleChange}
                  autoWidth
                  input={<OutlinedInput labelWidth={35} fullWidth name="role" id="role" required/>}
                >
                  <MenuItem value='UGPC_Member'>UGPC_Member</MenuItem>
                  <MenuItem value='Supervisor'>Supervisor</MenuItem>
                  <MenuItem value='Program_Office'>Program Office</MenuItem>
                  <MenuItem value='Chairman DCSSE'>Chairman</MenuItem>
                </Select>
              </FormControl>
              {errors.role && <Typography variant='caption' color='error'>Required*</Typography>}
            </Grid>
            {
              data.role === 'Program_Office' ? (
                  <Grid item xs={12} sm={12}>
                    <Typography variant='h5' style={{textAlign: 'center'}} color='textSecondary'>
                      No Further Details
                    </Typography>
                  </Grid>
                ) :
                (
                  data.role !== '' &&
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={errors.designation} variant="outlined"
                                 className={classes.formControl}>
                      <InputLabel htmlFor="designation">
                        Designation
                      </InputLabel>
                      <Select
                        value={data.designation}
                        onChange={handleChange}
                        autoWidth
                        input={<OutlinedInput labelWidth={97} fullWidth name="designation" id="designation" required/>}
                      >
                        <MenuItem value='Lecturer'>Lecturer</MenuItem>
                        <MenuItem value='Assistant Professor'>Assistant Professor</MenuItem>
                        <MenuItem value='Professor'>Professor</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.designation && <Typography variant='caption' color='error'>Required*</Typography>}
                  </Grid>
                )
            }

          </Grid>

        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewUserComponent;