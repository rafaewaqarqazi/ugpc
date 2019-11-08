import React from 'react';
import {Grid, TextField} from "@material-ui/core";

const OverviewComponent = ({titleError,title,handleChange,abstract,abstractError,scope,scopeError}) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={10} md={8}>
                <TextField
                    variant='outlined'
                    label='Title'
                    fullWidth
                    name='title'
                    placeholder='Project Title here'
                    required
                    error={titleError.show}
                    helperText={titleError.show ? titleError.message : `${title.length}/100`}
                    value={title}
                    onChange={handleChange}

                />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <TextField
                    variant='outlined'
                    label='Abstract'
                    fullWidth
                    name='abstract'
                    placeholder='Project Abstract here'
                    required
                    error={abstractError.show}
                    helperText={abstractError.show ? abstractError.message : `${abstract.length}/500`}
                    value={abstract}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <TextField
                    variant='outlined'
                    label='Scope'
                    fullWidth
                    name='scope'
                    placeholder='Project Scope here'
                    required
                    error={scopeError.show}
                    helperText={scopeError.show ? scopeError.message : `${scope.length}/500`}
                    value={scope}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
            </Grid>
        </Grid>
    );
};

export default OverviewComponent;