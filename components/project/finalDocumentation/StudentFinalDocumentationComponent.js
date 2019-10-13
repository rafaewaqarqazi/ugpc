import React, {useContext, useState} from 'react';
import ProjectContext from "../../../context/project/project-context";
import {
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    Tooltip, Zoom, IconButton, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody, Avatar
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {Close} from "@material-ui/icons";
import {DropzoneArea} from "material-ui-dropzone";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflowX:'auto'
    },
    tableRow:{
        "&:hover":{
            boxShadow:theme.shadows[6]
        }
    },
}));
const StudentFinalDocumentationComponent = () => {
    const projectContext = useContext(ProjectContext);
    const [openUploadDialog,setOpenUploadDialog] = useState(false);
    const classes = useStyles();
    const [file,setFile]=useState([]);
    const [fileError,setFileError] = useState(false);
    const [loading,setLoading]= useState(false);
    const [success,setSuccess] = useState(false);
    const handleDropZone = files=>{
        setFileError(false);
        setFile(files[0])
    };
    const handleUploadFile = ()=>{
        if (file.length === 0){
            setFileError(true)
        }
        else {
            setLoading(true);
            let formData = new FormData();
            formData.set('file',file);
            formData.set('projectId',projectContext.project.project._id);

            projectContext.uploadFinalDocumentation(formData)
                .then(res => {
                    setSuccess(true);
                    setOpenUploadDialog(false);
                    setLoading(false);
                })
                .catch(error => console.log(error))
        }

    };
    return (
        <div>
            <SuccessSnackBar message='Uploaded Successfully' open={success} handleClose={()=>setSuccess(false)}/>
            <div className={classes.listHeader}>
                <Button variant='outlined' color='primary' onClick={()=>setOpenUploadDialog(true)}>
                    Upload New Document
                </Button>
            </div>
            <Divider/>
            <div className={classes.tableWrapper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Sr No.</TableCell>
                            <TableCell align="left">File Name</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Uploaded At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            projectContext.project.project.documentation.finalDocumentation.map((doc,index) => (

                                    <TableRow key={index} className={classes.tableRow} >
                                        <TableCell align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">{doc.document.originalname}</TableCell>
                                        <TableCell >{doc.status}</TableCell>
                                        <TableCell align="left">{moment(doc.uploadedAt).format('MMM DD, YYYY')}</TableCell>
                                    </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog fullWidth maxWidth='xs' open={openUploadDialog} onClose={()=>setOpenUploadDialog(false)}>
                {loading && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Upload Final Documentation</Typography>
                    <Tooltip  title='Close Details' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=>setOpenUploadDialog(false)}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <DropzoneArea
                        onChange={handleDropZone}
                        acceptedFiles={['application/pdf']}
                        filesLimit={1}
                        dropzoneText='Drag and drop document file here or click'
                    />
                    {fileError && <Typography variant='caption' color='error'>Please Upload File</Typography> }
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={()=>setOpenUploadDialog(false)}>
                        Cancel
                    </Button>
                    <Button color='secondary' onClick={handleUploadFile}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StudentFinalDocumentationComponent;