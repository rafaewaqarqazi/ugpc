import React, {useEffect, useRef, useState, useContext} from 'react';
import {
    Avatar, Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress, MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {useSignInStyles} from "../../../src/material-styles/signin-styles";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import UserContext from '../../../context/user/user-context';
const NewUserComponent = () => {
    const userContext = useContext(UserContext);
    const classes = useSignInStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState({
        open:false,
        message:''
    });
    const [reject,setReject] = useState({
        open:false,
        message:''
    });
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [data,setData] = useState({
        name:'',
        email:'',
        role:'',
        position:'',
        committee:''
    });
    const [errors,setErrors] = useState({
        name:{
            show:false,
            message:''
        },
        email:{
            show:false,
            message:''
        },
        role:{
            show:false,
            message:''
        },
        position:{
            show:false,
            message:''
        }
    });
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    const handleSuccess = ()=>{
        setSuccess({open:false});
    };
    const handleCloseErrorSnackbar = ()=>{
        setReject({open:false})
    };
    const handleSubmit= e =>{
        e.preventDefault();
       setLoading(true);
        userContext.createUser(data)
            .then(res => {
                if (res.error){
                    setReject({open:true, message:res.error});
                    setLoading(false);
                }else {
                    setSuccess({open:true,message:res.message});
                    setLoading(false);
                    setData({
                        name:'',
                        email:'',
                        role:'',
                        position:'',
                        committee:''
                    })
                }
            });
    };
    const handleChange = e => {
        setErrors({
            ...errors,
            [e.target.name]:{
                show:false,
                message:''
            }
        });
        setData({...data, [e.target.name]: e.target.value})
    };

    return (
        <div>
            {loading && <LinearProgress color='secondary'/>}
            <SuccessSnackBar open={success.open} message={success.message} handleClose={handleSuccess}/>
            <ErrorSnackBar open={reject.open} message={reject.message} handleSnackBar={handleCloseErrorSnackbar}/>
            <Container component="main" maxWidth='xs'>
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>

                    <Typography variant="h5">
                        User Details
                    </Typography>
                </div>
                <form className={classes.form} onSubmit={handleSubmit}>

                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                label='Full Name'
                                fullWidth
                                name='name'
                                placeholder='Write Full Name'
                                required
                                error={errors.name.show}
                                helperText={errors.name.message}
                                value={data.name}
                                onChange={handleChange}

                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                variant='outlined'
                                label='Email'
                                fullWidth
                                name='email'
                                placeholder='someone@iiu.edu.pk'
                                required
                                error={errors.email.show}
                                helperText={errors.email.message}
                                value={data.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="role">
                                    Role
                                </InputLabel>
                                <Select
                                    value={data.role}
                                    onChange={handleChange}
                                    autoWidth
                                    input={<OutlinedInput  labelWidth={labelWidth} fullWidth name="role" id="role" required/>}
                                >
                                    <MenuItem value='UGPC_Member'>Member</MenuItem>
                                    <MenuItem value='Program_Office'>Program Office</MenuItem>
                                    <MenuItem value='Chairman DCSSE'>Chairman</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            data.role === 'Chairman' || data.role === 'Program_Office' ? (
                                <Grid item xs={12} sm={12}>
                                    <Typography variant='h5'>
                                        No Further Details
                                    </Typography>
                                </Grid>
                                ):
                                (
                                   data.role !== '' && <>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel ref={inputLabel} htmlFor="committee">
                                                    Committee
                                                </InputLabel>
                                                <Select
                                                    value={data.committee}
                                                    onChange={handleChange}
                                                    autoWidth
                                                    input={<OutlinedInput  labelWidth={labelWidth} fullWidth name="committee" id="committee" required/>}
                                                >
                                                    <MenuItem value='BSSE'>BSSE</MenuItem>
                                                    <MenuItem value='BSCS'>BSCS</MenuItem>
                                                    <MenuItem value='BSIT'>BSIT</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel ref={inputLabel} htmlFor="position">
                                                    Position
                                                </InputLabel>
                                                <Select
                                                    value={data.position}
                                                    onChange={handleChange}
                                                    autoWidth
                                                    input={<OutlinedInput  labelWidth={labelWidth} fullWidth name="position" id="position" required/>}
                                                >
                                                    <MenuItem value='Chairman_Committee'>Chairman</MenuItem>
                                                    <MenuItem value='Coordinator'>Coordinator</MenuItem>
                                                    <MenuItem value='Member'>Member</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </>
                                )
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            Create
                        </Button>
                    </Grid>
                </form>
            </Container>
        </div>
    );
};

export default NewUserComponent;