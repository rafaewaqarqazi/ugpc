import {useState} from 'react';
import {
    Avatar,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@material-ui/core';
import Link from "next/link";
import CopyrightComponent from "../components/CopyrightComponent";
import LandingPageLayout from "../components/Layouts/LandingPageLayout";
import {useStyles} from "../src/material-styles/signin-styles";

 const SignIn = ()  => {
    const classes = useStyles();
    const [email,setEmail]=useState('');
    const handleOnChange = event =>{
        console.log(event.target.value);
        setEmail(event.target.value)
    };
    return (
        <LandingPageLayout>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleOnChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/sign-up" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={5}>
                        <CopyrightComponent />
                    </Box>
                </div>

            </Container>
        </LandingPageLayout>
    );
}
export default SignIn;