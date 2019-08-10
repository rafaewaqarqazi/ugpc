import React, { useContext, Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {DropzoneArea} from 'material-ui-dropzone';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Typography,
    TextField,
    Grid, LinearProgress,
    Paper,
    Chip
} from '@material-ui/core';
import ProjectContext from '../../context/project/project-context';
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import {isValid} from '../../helpers/clientSideValidators/uploadVisionValidator';
import router from 'next/router';




const styles = theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
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
    },
    drag:{
        maxHeight:10
    },
    heading:{
        marginBottom: theme.spacing(2),
        padding:theme.spacing(2)
    }
});

const getSteps =()=> {
    return ['Overview', 'Details', 'Upload'];
};


class VisionDocumentComponent extends Component{
    static contextType = ProjectContext;
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            loading:false,
            success:false,
            title:'',
            abstract:'',
            scope:'',
            modules:[],
            file:[],
            titleError:{
                show:false,
                message:''
            },
            abstractError:{
                show:false,
                message:''
            },
            scopeError:{
                show:false,
                message:''
            },
            modulesError:{
                show:false,
                message:''
            },
            fileError:{
                show:false,
                message:''
            },
            currentModule:'',
        };
    }
    setTitleError=()=>{
        this.setState({
            titleError:{
                show:true,
                message:'Title Must Be between 2-100 Characters'
            }
        })
    }
    setAbstractError = ()=>{
        this.setState({
            abstractError:{
                show:true,
                message:'Abstract Must Be between 50-200 Characters'
            }
        })
    }
    setScopeError = ()=>{
        this.setState({
            scopeError:{
                show:true,
                message:'Scope Must Be between 50-200 Characters'
            }
        })
    }
    setModulesError = ()=>{
        this.setState({
            modulesError:{
                show:true,
                message:'Please Enter Your Major Modules'
            }
        })
    }
    setFileError = ()=>{
        this.setState({
            fileError:{
                show:true,
                message:'Please Attach your Document'
            }
        })
    }

    componentDidMount() {
        this.formData = new FormData();
    }

    handleSuccess= ()=>{
        this.setState({
            success:false
        });
        router.push('/student/overview')
    };

    handleNext = ()=> {
        if (!isValid(this.state,this.setTitleError, this.setAbstractError,this.setScopeError,this.setModulesError,this.setFileError)){
            this.setState(prevState =>({
                activeStep:prevState.activeStep + 1
            }));
        }
    };

     handleBack = () =>{
         this.setState(prevState =>({
             activeStep:prevState.activeStep - 1
         }));
    };
    handleSubmit=()=>{
        if (!isValid(this.state,this.setTitleError, this.setAbstractError,this.setScopeError,this.setModulesError,this.setFileError)){

            this.setState({
                loading:true
            });
            let mod = [];
            this.state.modules.map((module,i) =>{
                mod[i]=module.label;
            });
            this.formData.set('majorModules',JSON.stringify(mod));

            this.context.uploadVision(this.formData,this.context.project.project[0]._id)
                .then(res=>{
                    this.setState({
                        success:true
                    })
                })
                .catch(err => console.log(err.message));
        }


    };
    handleDelete = moduleToDelete => () => {
        this.setState({
            modules:this.state.modules.filter(module => module.key !== moduleToDelete.key)
        });
    };
    handleChange = e => {
        this.setState({
            titleError:{
                show:false,
                message:''
            },
            abstractError:{
                show:false,
                message:''
            },
            scopeError:{
                show:false,
                message:''
            },
            [e.target.name]: e.target.value
        });
        this.formData.set(e.target.name,e.target.value);
    };
    handleModuleChange = e => {
        this.setState({
            currentModule:e.target.value,
            modulesError:{
                show:false,
                message:''
            }
        });
    };
    handleSubmitModule = e =>{
        e.preventDefault();
        if (this.state.currentModule !== ''){
            this.setState({
                modules:[
                    ...this.state.modules,
                    {
                            key:this.state.modules.length+1,
                            label:this.state.currentModule
                    }
                ]
            });
           this.setState({currentModule:''})
        }

    };
    handleDropzone = (files)=>{
        console.log(files);
        this.setState({
            file:files[0]
        });
        this.formData.set('file',files[0]);
    }
     getStepContent = step => {
        switch (step) {
            case 0:
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
                                error={this.state.titleError.show}
                                helperText={this.state.titleError.message}
                                value={this.state.title}
                                onChange={this.handleChange}

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
                                error={this.state.abstractError.show}
                                helperText={this.state.abstractError.message}
                                value={this.state.abstract}
                                onChange={this.handleChange}
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
                                error={this.state.scopeError.show}
                                helperText={this.state.scopeError.message}
                                value={this.state.scope}
                                onChange={this.handleChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                const {classes} = this.props;
                return (
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={10} md={8}>
                            <Paper className={classes.moduleChip}>
                                {this.state.modules.length > 0 ? this.state.modules.map(module => {
                                    return (
                                        <Chip
                                            key={module.key}
                                            variant='outlined'
                                            color='secondary'
                                            label={module.label}
                                            onDelete={this.handleDelete(module)}
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
                            <form onSubmit={this.handleSubmitModule}>
                                <TextField
                                    variant='outlined'
                                    label='Add Module'
                                    fullWidth
                                    name='module'
                                    placeholder='Your Major Modules Title here'
                                    required
                                    value={this.state.currentModule}
                                    onChange={this.handleModuleChange}
                                    error={this.state.modulesError.show}
                                    helperText={this.state.modulesError.message}
                                />
                                <span className={classes.addModuleButton}>
                                    <Button  onClick={this.handleSubmitModule} variant='outlined' color='primary'>Add Module</Button>
                                </span>
                            </form>
                        </Grid>
                    </Grid>

                );
            case 2:
                return (
                    <Grid container spacing={1} >
                        <Grid item xs={12} sm={10} md={8}>
                            <DropzoneArea
                                onChange={this.handleDropzone}
                                acceptedFiles={['application/pdf']}
                                filesLimit={1}
                                dropzoneText='Drag and drop document file here or click'
                            />
                            {this.state.fileError.show && <Typography variant='caption' color='error'>{this.state.fileError.message}</Typography> }
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        return (
            <div className={classes.root}>
                {this.state.loading && <LinearProgress color='secondary'/>}
                <SuccessSnackBar open={this.state.success} message='Vision Document Uploaded' handleClose={this.handleSuccess}/>
                <Paper className={classes.heading}>
                    <Typography variant='h6'>
                        Upload Vision Document
                    </Typography>
                </Paper>
                <Stepper activeStep={this.state.activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {this.getStepContent(index)}
                                <div className={classes.actionsContainer}>
                                    <div>
                                        <Button
                                            disabled={this.state.activeStep === 0}
                                            onClick={this.handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color={this.state.activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                                            onClick={this.state.activeStep === steps.length - 1 ? this.handleSubmit : this.handleNext}
                                            className={classes.button}
                                        >
                                            {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </div>
        );
    }

}

export default withStyles(styles)(VisionDocumentComponent);