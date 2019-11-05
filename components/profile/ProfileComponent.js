import React, {useContext, useState} from 'react';
import UserContext from '../../context/user/user-context';
import {
    LinearProgress,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Button,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    CircularProgress,
    ExpansionPanel,
    TextField,
} from "@material-ui/core";
import {AccountCircleOutlined, ExpandMore} from "@material-ui/icons";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import {getRandomColor} from "../../src/material-styles/randomColors";
import moment from "moment";
import ProfileImageUpload from "./ProfileImageUpload";
import {serverUrl} from "../../utils/config";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import ProfileStudentDetails from "./ProfileStudentDetails";
const useProfileStyles = makeStyles(theme =>({
    innerContainer:{
        margin:theme.spacing(1)
    },
    generalContainer:{
        marginTop:theme.spacing(8),
    },
    profileImageContainer:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        padding:theme.spacing(3),
        borderRadius:5

    },
    profileAvatar:{
        height:128,
        width:128,
        marginTop: -theme.spacing(10),
        fontSize:32,
        backgroundColor:getRandomColor()
    },
    marginTop:{
        marginTop:theme.spacing(2)
    },
    verifiedColor:{
        backgroundColor: green[500],
        color:'#fff'
    },
    unVerifiedColor:{
        backgroundColor:theme.palette.error.dark,
        color:'#fff'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    expansionPanel:{
        boxShadow: theme.shadows[0]
    },
    namePassContainer:{
        padding:theme.spacing(1),
        minHeight:250
    },
    expansionContent:{
        width:'100%'
    },
    buttonWrapper: {
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    studentDetails:{
        padding:theme.spacing(2)
    }
}));
const ProfileComponent = () => {
    const userContext = useContext(UserContext);
    const profileClasses = useProfileStyles();
    const [expanded, setExpanded] = useState(false);
    const classes = useListContainerStyles();
    const [success,setSuccess]= useState({
        show:false,
        message:''
    });
    const [loading,setLoading] = useState({
        name:false,
        password:false,
        profileImage:false
    });
    const [error,setError] = useState({
        name:{
            show:false,
            message:''
        },
        oldPassword:{
            show:false,
            message:''
        },
        newPassword:{
            show:false,
            message:''
        },
        reTypePassword:{
            show:false,
            message:''
        }
    });
    const [state,setState] = useState({
        name:'',
        oldPassword:'',
        newPassword:'',
        reTypePassword:'',
        image:[]
    });
    const isValidName = name =>{
        if (name.length <4){
            setError({
                ...error,
                name:{
                    show:true,
                    message:'Name should contain at-least 4 Characters'
                },
            });
            return false;
        }
        return true;
    };
    const isValidPassword = (oldPassword,newPassword,reTypePassword) =>{
        if (oldPassword.length <8 ){
            setError({
                ...error,
                oldPassword:{
                    show:true,
                    message:'Password should contain at-least 8 Characters'
                },
            });
            return false;
        }else if (newPassword.length <8 ){
            setError({
                ...error,
                newPassword:{
                    show:true,
                    message:'Password should contain at-least 8 Characters'
                },
            });
            return false;
        }else if (reTypePassword.length <8 ){
            setError({
                ...error,
                reTypePassword:{
                    show:true,
                    message:'Password should contain at-least 8 Characters'
                },
            });
            return false;
        }else if (!newPassword.match(/\d/)){
            setError({
                ...error,
                newPassword:{
                    show:true,
                    message:'Password should contain at-least a Number'
                },
            });
            return false;
        }else if (!reTypePassword.match(/\d/)){
            setError({
                ...error,
                reTypePassword:{
                    show:true,
                    message:'Password should contain at-least a Number'
                },
            });
            return false;
        }else if (newPassword !== reTypePassword){
            setError({
                ...error,
                reTypePassword:{
                    show:true,
                    message:'Password does not match'
                },
            });
            return false;
        }
        return true;
    };
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleSubmitNameChange = e =>{
        e.preventDefault();
        if (isValidName(state.name)){
            setLoading({
                ...loading,
                name:true
            });
            userContext.changeName({name:state.name,userId:userContext.user.user._id})
                .then(result =>{
                    console.log(result);
                    setLoading({
                        ...loading,
                        name:false
                    });
                    setSuccess({
                        show:true,
                        message:result.message
                    });
                    setState({
                        ...state,
                        name:''
                    })
                })
        }

    };
    const handleChangeTextField = event =>{
        setError({
            name:{
                show:false,
                message:''
            },
            oldPassword:{
                show:false,
                message:''
            },
            newPassword:{
                show:false,
                message:''
            },
            reTypePassword:{
                show:false,
                message:''
            }
        });
        setState({
            ...state,
            [event.target.name]:event.target.value
        })
    };
    const handleSubmitPasswordChange = e =>{
        e.preventDefault();
        if (isValidPassword(state.oldPassword,state.newPassword,state.reTypePassword)){
            setLoading({
                ...loading,
                password:true
            });
            userContext.changePassword({oldPassword:state.oldPassword,newPassword:state.newPassword,userId:userContext.user.user._id})
                .then(result =>{
                    console.log(result);
                    if(result.error){
                        setError({
                            ...error,
                            oldPassword:{
                                show:true,
                                message:result.error
                            }
                        });
                        setLoading({
                            ...loading,
                            password:false
                        });
                        return;
                    }
                    setLoading({
                        ...loading,
                        password:false
                    });
                    setSuccess({
                        show:true,
                        message:result.message
                    });
                    setState({
                        ...state,
                        oldPassword:'',
                        newPassword:'',
                        reTypePassword:''
                    })
                })
        }
    };
    return (
        <div>
            <SuccessSnackBar open={success.show} message={success.message} handleClose={()=>setSuccess({show:false,message:''})}/>
            {
                userContext.user.isLoading ? <LinearProgress/> :
                    <div >
                        <div className={classes.listContainer} style={{backgroundColor:'#eee'}}>
                            <div className={classes.top}>
                                <div className={classes.topIconBox} >
                                    <AccountCircleOutlined className={classes.headerIcon}/>
                                </div>
                                <div className={classes.topTitle} >
                                    <Typography variant='h5' style={{textTransform:"capitalize"}} color='textSecondary'>{userContext.user.user.name}</Typography>
                                </div>
                            </div>

                            <div className={profileClasses.innerContainer}>
                                <Typography variant='h5' color='textSecondary'>General</Typography>
                                <div className={profileClasses.generalContainer}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={7}>
                                            <Paper className={profileClasses.profileImageContainer}>
                                                {
                                                    userContext.user.user.profileImage.filename ?
                                                        <Avatar src={`${serverUrl}/../static/images/${userContext.user.user.profileImage.filename }`}  className={profileClasses.profileAvatar}/>
                                                        :
                                                        <Avatar className={profileClasses.profileAvatar}>
                                                            { userContext.user.user.name.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                }


                                                <div className={profileClasses.marginTop}>
                                                    <ProfileImageUpload
                                                        userId={userContext.user.user._id}
                                                        uploadProfileImage={userContext.uploadProfileImage}
                                                        oldImage={userContext.user.user.profileImage.filename}
                                                    />
                                                </div>
                                                <Typography variant='subtitle1' color='textSecondary' className={profileClasses.marginTop}>Joined On {moment(userContext.user.user.createdAt).format('MMM DD, YYYY')}</Typography>
                                                <Chip
                                                    className={`${profileClasses.marginTop} ${userContext.user.user.isEmailVerified? profileClasses.verifiedColor : profileClasses.unVerifiedColor}`}
                                                    label={userContext.user.user.isEmailVerified ? 'Verified' :'Unverified'}
                                                />
                                                <Typography variant='subtitle1' color='textSecondary' className={profileClasses.marginTop}>{userContext.user.user.email}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <Paper className={profileClasses.namePassContainer}>
                                                <ExpansionPanel expanded={expanded === 'namePanel'} className={profileClasses.expansionPanel} onChange={handleChange('namePanel')}>
                                                    <ExpansionPanelSummary
                                                        expandIcon={<ExpandMore />}
                                                        aria-controls="namePanelbh-content"
                                                        id="namePanelbh-header"
                                                    >
                                                        <Typography className={profileClasses.heading}>Name</Typography>
                                                        <Typography className={profileClasses.secondaryHeading}>Change name</Typography>
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>

                                                        <div className={profileClasses.expansionContent}>
                                                            <form onSubmit={handleSubmitNameChange}>
                                                                <TextField
                                                                    label='New Full Name'
                                                                    margin='dense'
                                                                    variant='outlined'
                                                                    name='name'
                                                                    error={error.name.show}
                                                                    helperText={error.name.message}
                                                                    value={state.name}
                                                                    onChange={handleChangeTextField}
                                                                    required
                                                                    fullWidth
                                                                />
                                                                <div className={profileClasses.buttonWrapper}>
                                                                    <Button
                                                                        variant='outlined'
                                                                        color="primary"
                                                                        type='submit'
                                                                        fullWidth
                                                                        disabled={loading.name}
                                                                    >
                                                                        Change
                                                                    </Button>
                                                                    {loading.name && <CircularProgress size={24} className={profileClasses.buttonProgress} />}
                                                                </div>
                                                            </form>
                                                        </div>


                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                                <ExpansionPanel expanded={expanded === 'passwordPanel'} className={profileClasses.expansionPanel} onChange={handleChange('passwordPanel')}>
                                                    <ExpansionPanelSummary
                                                        expandIcon={<ExpandMore />}
                                                        aria-controls="passwordPanelbh-content"
                                                        id="passwordPanelbh-header"
                                                    >
                                                        <Typography className={profileClasses.heading}>Password</Typography>
                                                        <Typography className={profileClasses.secondaryHeading}>Change password</Typography>
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        <div className={profileClasses.expansionContent}>
                                                            <form onSubmit={handleSubmitPasswordChange}>
                                                                <TextField
                                                                    label='Old Password'
                                                                    margin='dense'
                                                                    variant='outlined'
                                                                    type='password'
                                                                    name='oldPassword'
                                                                    value={state.oldPassword}
                                                                    onChange={handleChangeTextField}
                                                                    error={error.oldPassword.show}
                                                                    helperText={error.oldPassword.message}
                                                                    required
                                                                    fullWidth
                                                                />
                                                                <TextField
                                                                    label='New Password'
                                                                    margin='dense'
                                                                    variant='outlined'
                                                                    type='password'
                                                                    name='newPassword'
                                                                    error={error.newPassword.show}
                                                                    helperText={error.newPassword.message}
                                                                    value={state.newPassword}
                                                                    onChange={handleChangeTextField}
                                                                    required
                                                                    fullWidth
                                                                />
                                                                <TextField
                                                                    label='ReType Password'
                                                                    margin='dense'
                                                                    variant='outlined'
                                                                    type='password'
                                                                    name='reTypePassword'
                                                                    error={error.reTypePassword.show}
                                                                    helperText={error.reTypePassword.message}
                                                                    value={state.reTypePassword}
                                                                    onChange={handleChangeTextField}
                                                                    required
                                                                    fullWidth
                                                                />
                                                                <div className={profileClasses.buttonWrapper}>
                                                                    <Button
                                                                        variant='outlined'
                                                                        color="primary"
                                                                        type='submit'
                                                                        fullWidth
                                                                        disabled={loading.password}
                                                                    >
                                                                        Change
                                                                    </Button>
                                                                    {loading.password && <CircularProgress size={24} className={profileClasses.buttonProgress} />}
                                                                </div>
                                                            </form>
                                                        </div>


                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </div>

                            </div>
                            {
                                userContext.user.user.role === 'Student' &&
                            <div className={`${profileClasses.innerContainer} ${profileClasses.marginTop}`}>
                                <Typography variant='h5' color='textSecondary'>Details</Typography>

                                    <Paper className={`${profileClasses.studentDetails} ${profileClasses.marginTop}`}>
                                        <ProfileStudentDetails
                                            studentDetails={userContext.user.user.student_details}
                                            department={userContext.user.user.department}
                                            />
                                    </Paper>

                            </div>
                            }

                        </div>
                    </div>

            }
        </div>
    );
};

export default ProfileComponent;