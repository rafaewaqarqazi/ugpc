import React from 'react';
import {Typography, Container, Avatar, Button} from "@material-ui/core";
import {usePendingStyles} from "../../src/material-styles/pending-page";
import {signout} from "../../auth";

const NotEligible = () => {
  const classes = usePendingStyles();

  return (
    <div>

      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Avatar alt="IIUI-LOGO" src="/static/avatar/iiui-logo.jpg" className={classes.avatar}/>
          <Typography paragraph className={`${classes.message} ${classes.notEligible}`}>
            Sorry! You are not Eligible for FYP
          </Typography>
          <Button variant='contained' color='primary' onClick={() => signout()}>
            Sign Out
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotEligible;