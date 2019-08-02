import React from 'react';
import {Avatar, Box, Button, Grid, TextField, Typography} from "@material-ui/core";
import Link from "next/link";
import {useStyles} from "../src/material-styles/signin-styles";
import CopyrightComponent from "./CopyrightComponent";

const SignUpComponent = () => {
    const classes = useStyles();
    return (
        <div className={classes.paper}>
            <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="fname"
                            name="firstName"
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Sign Up
                </Button>
                <Grid container justify="center">
                    <Grid item>
                        <Link href="/sign-in">
                            <a>Already have an account? Sign in</a>
                        </Link>
                    </Grid>
                </Grid>
            </form>
            <Box mt={5}>
                <CopyrightComponent />
            </Box>
        </div>

    );
};

export default SignUpComponent;