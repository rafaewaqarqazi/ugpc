import React, {Component} from 'react';
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Tooltip,
    Typography,
    Zoom,
    Slider
} from "@material-ui/core";
import {BackupOutlined, Close} from "@material-ui/icons";
import AvatarEditor from "react-avatar-editor";
import {DropzoneArea} from "material-ui-dropzone";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
class ProfileImageUpload extends Component {

    constructor(props) {
        super(props);
        this.state={
            image:[],
            loading:false,
            dialog:false,
            scale:1,
            success:false
        };
        this.formData = new FormData();
    }
    setEditorRef = (editor) => this.editor = editor;
    handleDropZone = images =>{
        this.setState({
            image:images[0]
        })
    };
    handleChangeZoom = (event,value) =>{
        this.setState({
            scale:parseFloat(value)
        })
    };
    onClickSave = () => {
        if (this.editor) {
            this.setState({
                loading:true
            });
            const canvas = this.editor.getImageScaledToCanvas().toDataURL();
            fetch(canvas)
                .then(res => res.blob())
                .then(blob => {
                    this.formData.set('file',blob,this.state.image.fileName);
                    this.formData.set('userId',this.props.userId);
                    this.props.uploadProfileImage(this.formData)
                        .then(result => {
                            if (result.error){
                                return
                            }
                            this.setState({
                                image:[],
                                croppedImage:'',
                                loading:false,
                                dialog:false,
                                scale:1,
                                success:true
                            })
                        })
                });
        }
    };

    render() {
        return (
            <div>
                <SuccessSnackBar message='Uploaded Successfully' open={this.state.success} handleClose={()=>this.setState({success:false})}/>
                <Button startIcon={<BackupOutlined/>} variant='outlined'onClick={()=>this.setState({dialog:true})}>Upload Image</Button>
                <Dialog fullWidth maxWidth='xs' open={this.state.dialog} onClose={()=>this.setState({dialog:false})}>
                    {this.state.loading && <LinearProgress/>}
                    <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                        <Typography variant='h6' noWrap style={{flexGrow:1}}>Upload Profile Image</Typography>
                        <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                            <IconButton size='small' onClick={()=>this.setState({dialog:false})}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent dividers>
                        {
                            this.state.image.length !== 0 ?
                            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <AvatarEditor
                                    ref={this.setEditorRef}
                                    image={this.state.image}
                                    width={200}
                                    height={200}
                                    border={50}
                                    borderRadius={100}
                                    color={[255, 255, 255, 0.6]} // RGBA
                                    scale={this.state.scale}
                                    rotate={0}
                                />
                                <Typography gutterBottom>
                                    Zoom
                                </Typography>
                                <Slider
                                    value={this.state.scale}
                                    onChange={this.handleChangeZoom}
                                    step={0.01}
                                    max={2}
                                    min={1}
                                    defaultValue={1}
                                />
                            </div>
                                :
                                <DropzoneArea
                                    onChange={this.handleDropZone}
                                    acceptedFiles={['image/*']}
                                    filesLimit={1}
                                    showPreviews={false}
                                    maxFileSize={6000000}
                                    showPreviewsInDropzone={false}
                                    dropzoneText='Drag and drop image here or click'
                                />
                        }


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>this.setState({dialog:false})}>Cancel</Button>
                        <Button  color='primary' onClick={this.onClickSave}>Upload</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ProfileImageUpload;