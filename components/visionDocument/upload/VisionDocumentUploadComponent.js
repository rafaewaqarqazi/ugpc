import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {DropzoneArea} from 'material-ui-dropzone';
import {
    Typography,
    Grid, LinearProgress,
} from '@material-ui/core';
import ProjectContext from '../../../context/project/project-context';
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {isValid} from '../../../utils/clientSideValidators/uploadVisionValidator';
import router from 'next/router';
import TitleComponent from "../../title/TitleComponent";
import DetailsComponent from "./DetailsComponent";
import OverviewComponent from "./OverviewComponent";
import StepperComponent from "../../stepper/StepperComponent";

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
    drag:{
        maxHeight:10
    },

});


class VisionDocumentUploadComponent extends Component{
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
    };
    setAbstractError = ()=>{
        this.setState({
            abstractError:{
                show:true,
                message:'Abstract Must Be between 50-200 Characters'
            }
        })
    };
    setScopeError = ()=>{
        this.setState({
            scopeError:{
                show:true,
                message:'Scope Must Be between 50-200 Characters'
            }
        })
    };
    setModulesError = ()=>{
        this.setState({
            modulesError:{
                show:true,
                message:'Please Enter Your Major Modules'
            }
        })
    };
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
        router.push('/student/roadmap')
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

            this.context.uploadVision(this.formData,this.context.project.project._id)
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
    handleDropZone = (files)=>{
        this.setState({
            file:files[0]
        });
        this.formData.set('file',files[0]);
    };
     getStepContent = step => {
        switch (step) {
            case 0:
                const {title,titleError,abstract,abstractError,scope,scopeError} = this.state;
                return (
                    <OverviewComponent
                        title={title}
                        titleError={titleError}
                        abstract={abstract}
                        abstractError={abstractError}
                        scope={scope}
                        scopeError={scopeError}
                        handleChange={this.handleChange}
                    />
                );
            case 1:
                const {currentModule,modules,modulesError} = this.state;
                return (
                    <DetailsComponent
                        currentModule={currentModule}
                        handleDelete={this.handleDelete}
                        handleModuleChange={this.handleModuleChange}
                        handleSubmitModule={this.handleSubmitModule}
                        modules={modules}
                        modulesError={modulesError}
                    />
                );
            case 2:
                return (
                    <Grid container spacing={1} >
                        <Grid item xs={12} sm={10} md={8}>
                            <DropzoneArea
                                onChange={this.handleDropZone}
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

        return (
            <div className={classes.root}>
                {this.state.loading && <LinearProgress color='secondary'/>}
                <SuccessSnackBar open={this.state.success} message='Vision Document Uploaded' handleClose={this.handleSuccess}/>
               <StepperComponent
                   steps={['Overview', 'Details', 'Upload']}
                   handleBack={this.handleBack}
                   handleNext={this.handleNext}
                   handleSubmit={this.handleSubmit}
                   getStepContent={this.getStepContent}
                   activeStep={this.state.activeStep}
               />
            </div>
        );
    }

}

export default withStyles(styles)(VisionDocumentUploadComponent);