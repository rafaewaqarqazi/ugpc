import React from 'react';
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  loading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
}))

const CircularLoading = () => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress color='secondary'/>
    </div>


  );
};

export default CircularLoading;