import React from 'react';
import {Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme=>({
    heading:{
        marginBottom: theme.spacing(2),
        padding:theme.spacing(2)
    }
}));
const TitleComponent = ({title}) => {
    const classes = useStyles();
    return (
        <Paper className={classes.heading}>
            <Typography variant='h6'>
                {title}
            </Typography>
        </Paper>
    );
};

export default TitleComponent;