import React, {useState} from 'react';
import {Avatar, Box, Button, Grid, TextField, Typography,Snackbar,SnackbarContent,IconButton} from "@material-ui/core";
import Link from "next/link";
import CopyrightComponent from "./CopyrightComponent";
import {useStyles} from "../src/material-styles/signin-styles";
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import router from 'next/router';
import {signin,authenticate} from "../auth";

const SignInComponent = () => {
    const classes = useStyles();
    const [state,setState]=useState({
        email:'',
        password:''
    });
    const [error,setError] = useState({
        emailError:false,
        emailErrorText:'',
        passwordError:false,
        passwordErrorText:'',
        serverResError:false,
        serverResErrorText:'',
    });

    const handleChange = name => event =>{
        setState({...state, [name]:event.target.value})
    };

    const handleSubmit = e =>{
        e.preventDefault();
        console.log(state);
        const user = {
            email:state.email,
            password:state.password
        };

        signin(user)
            .then(data => {
                if (data.error){
                    setError({...error,
                        serverResError:true,
                        serverResErrorText:data.error
                    })
                }else {
                    authenticate(data,()=>{
                        router.push('/student')
                    })
                }
            }).catch (e=> {
                console.log(e.message)
            })



    };
    const handleSnackBar = ()=>{
        setState({...state,serverResError:false,serverResErrorText: ''})
    };
    return (
        <div className={classes.paper}>
            <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={error.serverResError}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                onClose={handleSnackBar}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classes.error}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.errorMessage}>
                            <ErrorIcon  className={classes.iconVariant}/>
                            {error.serverResErrorText}
                        </span>
                    }
                    action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={handleSnackBar}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>

            <form className={classes.form} onSubmit={handleSubmit}>
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
                    value={state.email}
                    onChange={handleChange('email')}
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
                    value={state.password}
                    onChange={handleChange('password')}
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
                        <Link href="/forgot-password" >
                            <a >Forgot password?</a>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/sign-up" >
                            <a >Don't have an account? Sign Up</a>
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

export default SignInComponent;