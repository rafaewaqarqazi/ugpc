import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Container, LinearProgress
} from "@material-ui/core";
import Link from "next/link";
import CopyrightComponent from "./CopyrightComponent";
import {useSignInStyles} from "../src/material-styles/signin-styles";
import {signin,authenticate} from "../auth";
import ErrorSnackBar from "./snakbars/ErrorSnackBar";

const SignInComponent = () => {
    const classes = useSignInStyles();
    const [state,setState]=useState({
        email:'',
        password:''
    });
    const [loading, setLoading] = useState(false);
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
        const user = {
            email:state.email.toLowerCase(),
            password:state.password
        };
        setLoading(true);
        signin(user)
            .then(data => {
                if (data.error){
                    setError({...error,
                        serverResError:true,
                        serverResErrorText:data.error
                    })
                    setLoading(false)
                }else {
                    setLoading(false)
                    authenticate(data)
                }

            }).catch (e=> {
                console.log(e.message)
            })
    };
    const handleSnackBar = ()=>{
        setError({...error,serverResError:false,serverResErrorText: ''});

    };
    return (
        <div >
            {loading && <LinearProgress color='secondary'/>}
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                </div>
                <ErrorSnackBar
                    message={error.serverResErrorText}
                    open={error.serverResError}
                    handleSnackBar={handleSnackBar}
                />

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
                            <Link href="/student/sign-up" >
                                <a >Don't have an account? Sign Up</a>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                <Box mt={5}>
                    <CopyrightComponent />
                </Box>
            </Container>
        </div>

    );
};

export default SignInComponent;