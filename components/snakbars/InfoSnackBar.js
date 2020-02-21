import React from 'react';
import {IconButton, Snackbar, SnackbarContent} from "@material-ui/core";
import {Info, Close} from "@material-ui/icons";
import {useSnakBarStyles} from "../../src/material-styles/snakbar";

const InfoSnackBar = ({open, setOpen, message}) => {
  const classes = useSnakBarStyles();
  return (
    <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      open={open}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      onClose={() => setOpen(false)}
      autoHideDuration={2500}
    >
      <SnackbarContent
        className={classes.info}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
                                <Info className={classes.iconVariant}/>
            {message}
                            </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
            <Close/>
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default InfoSnackBar;