import React from 'react';
import {Avatar, Container, LinearProgress} from "@material-ui/core";
import {useStyles} from "../../src/material-styles/page-loading";

const PageLoading = () => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
      </div>
      <LinearProgress color='secondary'/>
    </Container>
  );
};

export default PageLoading;