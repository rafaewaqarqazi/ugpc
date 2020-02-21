import React from 'react';
import {Box, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  heading: {
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(2)
  }
}));
const TitleComponent = ({title}) => {
  const classes = useStyles();
  return (
    <Box boxShadow={3} className={classes.heading}>
      <Typography variant='h5' color='textSecondary'>
        {title}
      </Typography>
    </Box>
  );
};

export default TitleComponent;