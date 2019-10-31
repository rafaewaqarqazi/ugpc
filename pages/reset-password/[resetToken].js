import React, {useState} from 'react';
import {Box, Button, Container, LinearProgress, TextField, Typography} from "@material-ui/core";
import SuccessSnackBar from "../../components/snakbars/SuccessSnackBar";
import ErrorSnackBar from "../../components/snakbars/ErrorSnackBar";
import CopyrightComponent from "../../components/CopyrightComponent";
import {useStyles} from "../../src/material-styles/page-loading";
import {useRouter} from "next/router";
import {resetPassword} from "../../auth";
import LandingPageLayout from "../../components/Layouts/LandingPageLayout";
import {withLandingAuthSync} from "../../components/routers/landingAuth";

const ResetToken = () => {
    const classes = useStyles();
    const router = useRouter();
    const {resetToken} = router.query;
    const [newPassword,setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resMessage,setResMessage] = useState({
        open:false,
        message:''
    });
    const [error,setError] = useState({
        resError:{
            open:false,
            message:''
        },
        password:{
            open:false,
            message:''
        }
    });
    const handleChange =event => {
        setError({
            ...error,
            password:{
                open:false,
                message:''
            }
        });
        setNewPassword(event.target.value);
    };
    const handleSubmit = e => {
        e.preventDefault();

        if (isValid()){
            setLoading(true);
            resetPassword({newPassword,resetPasswordLink:resetToken})
                .then(res => {
                    if (res.error){
                        setError({
                            ...error,
                            resError:{
                                open:true,
                                message:res.error
                            }
                        })
                    }else {
                        setResMessage({
                            open:true,
                            message:res.message
                        });
                    }

                })
                .catch(err =>{
                    setError({
                        ...error,
                        resError:{
                            open:true,
                            message:err.message
                        }
                    })
                })
        }

    };
    const handleClose = ()=>{
        setResMessage({open:false, message:''});
        router.push('/sign-in')
    };
    const handleError = ()=>{
        setError({open:false,
            message:''})
    };
    const isValid = ()=>{
        if (newPassword.length < 8){
            setError({
                ...error,
                password:{
                    open:true,
                    message:'Password Should contain at-least 8 characters'
                }
            });
            return false;
        }else if (!newPassword.match(/\d/)){
            setError({
                ...error,
                password:{
                    open:true,
                    message:'Password Should include at-least one number'
                }
            });
            return false;
        }
        return true;
    }
    return (
        <LandingPageLayout>
            {loading && <LinearProgress color='secondary'/>}
            <SuccessSnackBar message={resMessage.message} open={resMessage.open} handleClose={handleClose}/>
            <ErrorSnackBar open={error.resError.open} message={error.resError.message} handleSnackBar={handleError}/>
            <Container component='main' maxWidth='xs'>
                <Typography variant={'h4'} className={classes.paper}>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type='password'
                        name="newPassword"
                        label="New Password"
                        error={error.password.open}
                        helperText={error.password.message}
                        value={newPassword}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                    >
                        Reset
                    </Button>
                </form>
                <Box mt={5}>
                    <CopyrightComponent />
                </Box>
            </Container>
        </LandingPageLayout>
    );
};

export default  withLandingAuthSync(ResetToken);