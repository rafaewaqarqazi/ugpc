import React, {useState} from 'react';
import {Box, Button, Container, LinearProgress, TextField, Typography} from "@material-ui/core";
import SuccessSnackBar from "../components/snakbars/SuccessSnackBar";
import ErrorSnackBar from "../components/snakbars/ErrorSnackBar";
import CopyrightComponent from "../components/CopyrightComponent";
import {useStyles} from "../src/material-styles/page-loading";
import {useRouter} from "next/router";
import {forgotPassword} from "../auth";
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {withLandingAuthSync} from "../components/routers/landingAuth";

const ForgotPassword = () => {
  const classes = useStyles();
  const router = useRouter();
  const {id} = router.query;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState({
    open: false,
    message: ''
  });
  const [error, setError] = useState({
    open: false,
    message: ''
  });
  const handleChange = event => {
    setEmail(event.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    forgotPassword(email)
      .then(res => {
        if (res.error) {
          setError({
            open: true,
            message: res.error
          });
          setLoading(false);
        } else {
          setResMessage({
            open: true,
            message: res.message
          });
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
  return (
    <LandingPageLayout>
      {loading && <LinearProgress color='secondary'/>}
      <SuccessSnackBar message={resMessage.message} open={resMessage.open} handleClose={handleClose}/>
      <ErrorSnackBar open={error.open} message={error.message} handleSnackBar={handleError}/>
      <Container component='main' maxWidth='xs'>
        <Typography variant={'h4'} className={classes.paper}>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="forgotPassword"
            label="Your Email"
            value={email}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
          >
            Reset
          </Button>
        </form>
        <Box mt={5}>
          <CopyrightComponent/>
        </Box>
      </Container>
    </LandingPageLayout>
  );
};

export default withLandingAuthSync(ForgotPassword);