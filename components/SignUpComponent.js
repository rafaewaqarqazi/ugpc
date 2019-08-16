import React, {useState, useRef, useEffect} from 'react';
import {Avatar, Box, Button, Grid, TextField, Typography,
    OutlinedInput,InputLabel, MenuItem, FormControl, Select,
    SnackbarContent,Snackbar, LinearProgress,Container
} from "@material-ui/core";
import Link from "next/link";
import {useSignInStyles} from "../src/material-styles/signin-styles";
import CopyrightComponent from "./CopyrightComponent";
import {signup} from "../auth";
import router from 'next/router';
import SuccessSnackBar from "./snakbars/SuccessSnackBar";
import ErrorSnackBar from "./snakbars/ErrorSnackBar";

const SignUpComponent = () => {
    const classes = useSignInStyles();

    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
        regNo:'',
        department: '',
        batch: '',
    });
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState({
        open:false,
        message:''
    });
    const [resMessage,setResMessage] = useState({
        open:false,
        message:'',
        id:''
    });
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    const handleChange = event =>{
        setValues({...values,[event.target.name]:event.target.value})
    };
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        const user = {
            name:values.name,
            email:values.email,
            password:values.password,
            department:values.department,
            student_details:{
                batch:values.batch,
                regNo:`${values.regNo}-FBAS/${values.department}/${values.batch}`
            }
        };
        signup(user)
            .then(data => {
                setLoading(false);
                if (data.error){
                    setError({open:true,message:data.error})
                }else{
                    setResMessage({open:true,message:data.message,id:data._id})
                }


            })
            .catch(err => {console.log(err)})
    };

    const handleSuccess = ()=>{
        setResMessage({...resMessage,open:false, message:''});
        router.push(`/student/verify-email?id=${resMessage.id}`, `/student/verify-email/${resMessage.id}`)
    };
    const handleError = ()=>{
        setError({open:false,message:''})
    };
    return (
        <div >
            {loading && <LinearProgress color='secondary'/>}
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>

                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                </div>
                <div className={classes.root}>
                    <SuccessSnackBar open={resMessage.open} message={resMessage.message} handleClose={handleSuccess}/>
                    <ErrorSnackBar message={error.message} open={error.open} handleSnackBar={handleError}/>
                </div>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField
                                autoComplete="fname"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="fullName"
                                value={values.name}
                                onChange={handleChange}
                                label="Full Name"
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                value={values.email}
                                onChange={handleChange}
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
                                value={values.password}
                                onChange={handleChange}
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={values.regNo}
                                onChange={handleChange}
                                name="regNo"
                                label="Reg No"
                                id="regNo"
                               placeholder={'1111'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="department">
                                   Department
                                </InputLabel>
                                <Select
                                    value={values.department}
                                    onChange={handleChange}
                                    autoWidth
                                    input={<OutlinedInput  labelWidth={labelWidth} fullWidth name="department" id="department" required/>}
                                >
                                    <MenuItem value='BSSE'>BSSE</MenuItem>
                                    <MenuItem value='BSCS'>BSCS</MenuItem>
                                    <MenuItem value='BSIT'>BSIT</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="batch">
                                    Batch
                                </InputLabel>
                                <Select
                                    value={values.batch}
                                    onChange={handleChange}
                                    autoWidth
                                    input={<OutlinedInput  labelWidth={labelWidth} fullWidth name="batch" id="batch" required/>}
                                >
                                    <MenuItem value='F15'>F15</MenuItem>
                                    <MenuItem value='F16'>F16</MenuItem>
                                    <MenuItem value='F17'>F17</MenuItem>
                                </Select>
                            </FormControl>
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
            </Container>
        </div>

    );
};

export default SignUpComponent;