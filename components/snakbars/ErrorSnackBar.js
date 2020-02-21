import React from 'react';
import {IconButton, Snackbar, SnackbarContent} from "@material-ui/core";
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import {useSnakBarStyles} from "../../src/material-styles/snakbar";

const ErrorSnackBar = ({handleSnackBar, open, message}) => {
  const classes = useSnakBarStyles();
  return (
    <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      open={open}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      onClose={handleSnackBar}
      autoHideDuration={3000}
    >
      <SnackbarContent
        className={classes.error}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
                                <ErrorIcon className={classes.iconVariant}/>
            {message}
                            </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleSnackBar}>
            <CloseIcon/>
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default ErrorSnackBar;