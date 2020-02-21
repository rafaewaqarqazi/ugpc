import React from 'react';
import {DialogTitle, Typography, Tooltip, IconButton, Zoom} from "@material-ui/core";
import {Close} from "@material-ui/icons";

const DialogTitleComponent = ({title, handleClose}) => {
  return (
    <DialogTitle style={{display: 'flex', flexDirection: 'row'}} disableTypography>
      <Typography variant='h6' noWrap style={{flexGrow: 1}}>{title}</Typography>
      <Tooltip title='Close' placement="top" TransitionComponent={Zoom}>
        <IconButton size='small' onClick={handleClose}>
          <Close/>
        </IconButton>
      </Tooltip>
    </DialogTitle>
  );
};

export default DialogTitleComponent;