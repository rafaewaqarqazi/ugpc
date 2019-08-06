import React from 'react';
import {IconButton, Snackbar, SnackbarContent} from "@material-ui/core";
import {CheckCircle, Close} from "@material-ui/icons";
import {useSnakBarStyles} from "../../src/material-styles/snakbar";

const SuccessSnackBar = ({open, handleClose,message}) => {
    const classes = useSnakBarStyles();
    return (
        <Snackbar
            anchorOrigin={{ vertical:'top', horizontal:'center' }}
            open={open}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            onClose={handleClose}
            autoHideDuration={3000}
        >
            <SnackbarContent
                className={classes.success}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                                <CheckCircle className={classes.iconVariant}/>
                        {message}
                            </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
};

export default SuccessSnackBar;