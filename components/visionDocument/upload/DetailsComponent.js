import React from 'react';
import {Button, Chip, Grid, Paper, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    moduleChip:{
        padding: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    addModuleButton:{
        display:'flex',
        flexDirection:'row-reverse',
        marginTop:theme.spacing(1)
    }
}));

const DetailsComponent = ({modules, handleDelete, handleSubmitModule,currentModule,handleModuleChange,modulesError}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={10} md={8}>
                <Paper className={classes.moduleChip}>
                    {modules.length > 0 ? modules.map(module => {
                            return (
                                <Chip
                                    key={module.key}
                                    variant='outlined'
                                    color='secondary'
                                    label={module.label}
                                    onDelete={handleDelete(module)}
                                    className={classes.chip}
                                />
                            );
                        }):
                        <Chip
                            variant='outlined'
                            color='primary'
                            label={'No Modules Added Yet'}
                            className={classes.chip}
                        />
                    }
                </Paper>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <form onSubmit={handleSubmitModule}>
                    <TextField
                        variant='outlined'
                        label='Add Module'
                        fullWidth
                        name='module'
                        placeholder='Your Major Modules Title here'
                        required
                        value={currentModule}
                        onChange={handleModuleChange}
                        error={modulesError.show}
                        helperText={modulesError.message}
                    />
                    <span className={classes.addModuleButton}>
                                    <Button  onClick={handleSubmitModule} variant='outlined' color='primary'>Add Module</Button>
                                </span>
                </form>
            </Grid>
        </Grid>

    );
};

export default DetailsComponent;