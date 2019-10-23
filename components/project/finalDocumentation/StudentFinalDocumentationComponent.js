import React, {useContext, useState} from 'react';
import ProjectContext from "../../../context/project/project-context";
import {
    Button,
    Divider,
    Chip,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Tooltip, Zoom, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {PictureAsPdfOutlined} from "@material-ui/icons";
import {DropzoneArea} from "material-ui-dropzone";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import moment from "moment";
import {serverUrl} from "../../../utils/config";
import {getGrade} from "../../../utils";
import {getGradeChipColor} from "../../../src/material-styles/visionDocsListBorderColor";
import DialogTitleComponent from "../../DialogTitleComponent";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

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
    const emptyStyles = useListItemStyles();
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
            {
                projectContext.project.project.documentation.visionDocument.filter(doc => doc.status === 'Approved' || doc.status === 'Approved With Changes').length > 0 &&
                (projectContext.project.project.phase === 'Documentation' ||
                projectContext.project.project.documentation.finalDocumentation.filter(fDoc => fDoc.status === 'NotApproved').length > 0) &&
                <div className={classes.listHeader}>
                    <Button variant='outlined' color='primary' onClick={()=>setOpenUploadDialog(true)}>
                        Upload New Document
                    </Button>
                </div>
            }

            <Divider/>
            <div className={classes.tableWrapper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SrNo.</TableCell>
                            <TableCell align="left">File Name</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">File</TableCell>
                            <TableCell align="left">Grade</TableCell>
                            <TableCell align="left">Uploaded At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            projectContext.project.project.documentation.finalDocumentation.length === 0?
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className={emptyStyles.emptyListContainer}>
                                            <div className={emptyStyles.emptyList}>
                                                No Documents Found
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                :
                            projectContext.project.project.documentation.finalDocumentation.map((doc,index) => (

                                    <TableRow key={index} className={classes.tableRow} >
                                        <TableCell align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">{doc.document.originalname}</TableCell>
                                        <TableCell >{doc.status}</TableCell>
                                        <TableCell >
                                            <Tooltip  title='Click to View/Download Document' placement="top" TransitionComponent={Zoom}>
                                                <a style={{textDecoration:'none',color:'grey'}} href={`${serverUrl}/../pdf/${doc.document.filename}`} target="_blank" >
                                                    <PictureAsPdfOutlined />
                                                </a>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                doc.status === 'Completed' ? <Chip label={getGrade(projectContext.project.project.details.marks)} style={getGradeChipColor(getGrade(projectContext.project.project.details.marks))}/> :'Not Specified Yet'
                                            }
                                        </TableCell>
                                        <TableCell align="left">{moment(doc.uploadedAt).format('MMM DD, YYYY')}</TableCell>
                                    </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog fullWidth maxWidth='xs' open={openUploadDialog} onClose={()=>setOpenUploadDialog(false)}>
                {loading && <LinearProgress/>}
                <DialogTitleComponent title={'Upload Final Documentation'} handleClose={()=>setOpenUploadDialog(false)}/>
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