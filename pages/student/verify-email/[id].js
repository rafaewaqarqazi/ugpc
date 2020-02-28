import router, {useRouter} from "next/router";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  LinearProgress
} from "@material-ui/core";
import React, {useState} from 'react';
import {useStyles} from "../../../src/material-styles/page-loading";
import CopyrightComponent from "../../../components/CopyrightComponent";
import SuccessSnackBar from "../../../components/snakbars/SuccessSnackBar";
import ErrorSnackBar from "../../../components/snakbars/ErrorSnackBar";
import {authenticate, isAuthenticated, verifyEmail, resendVerificationCode} from "../../../auth";

const VerifyEmail = () => {
  const classes = useStyles();
  const router = useRouter();
  const {id} = router.query;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState({
    open: false,
    message: ''
  });
  const [resendMessage, setResendMessage] = useState({
    open: false,
    message: ''
  });
  const [error, setError] = useState({
    open: false,
    message: ''
  });
  const handleChange = event => {
    setCode(event.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      _id: id,
      emailVerificationCode: code
    };
    verifyEmail(data)
      .then(res => {
        if (res.error) {
          setError({
            open: true,
            message: res.error
          })
        } else {

          if (isAuthenticated()) {
            const jwt = {
              ...isAuthenticated(),
              user: {
                ...isAuthenticated().user,
                isEmailVerified: true
              }
            };
            authenticate(jwt, () => {
              setResMessage({open: true, message: res.message});
            })
          } else {
            setResMessage({open: true, message: res.message});
          }
        }

      })
  };
  const handleClose = () => {
    setResMessage({open: false, message: ''});
    router.push('/sign-in')
  };
  const handleError = () => {
    setError({
      open: false,
      message: ''
    })
  };
  const resendVerCode = () => {
    setLoading(true);
    const data = {
      _id: id
    };
    resendVerificationCode(data)
      .then(res => {
        if (res.error) {
          setError({
            open: true,
            message: res.error
          })
        } else {
          setLoading(false);
          setResendMessage({open: true, message: res.message});
        }

      })
  };
  const handleCloseResend = () => {
    setResendMessage({open: false, message: ''});
    router.push(`/student/verify-email/[id]`, `/student/verify-email/${id}`)
  }
  return (
    <div>
      {loading && <LinearProgress color='secondary'/>}
      <SuccessSnackBar message={resMessage.message} open={resMessage.open} handleClose={handleClose}/>
      <SuccessSnackBar message={resendMessage.message} open={resendMessage.open} handleClose={handleCloseResend}/>
      <ErrorSnackBar open={error.open} message={error.message} handleSnackBar={handleError}/>
      <Container component='main' maxWidth='xs'>
        <Typography variant={'h4'} className={classes.paper}>
          Verify Email
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="verCode"
            label="Email Verification Code"
            id="verCode"
            value={code}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"

          >
            Verify
          </Button>
          <Typography variant='caption' onClick={resendVerCode} className={classes.resendCode}>Resend Code?</Typography>
        </form>
        <Box mt={5}>
          <CopyrightComponent/>
        </Box>
      </Container>
    </div>
  );
};


export default VerifyEmail;