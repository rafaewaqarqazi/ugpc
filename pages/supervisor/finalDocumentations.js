import React, {useEffect, useState} from 'react';
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import {fetchFinalDocumentationsBySupervisorAPI} from "../../utils/apiCalls/projects";
import {
    Container,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {Assignment} from "@material-ui/icons";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {makeStyles} from "@material-ui/styles";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(5),
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
const FinalDocumentations = () => {
    const [loading,setLoading]=useState(true);
    const [documents,setDocuments]= useState([]);
    const listContainerStyles = useListContainerStyles();
    const classes = useStyles();
    useEffect(()=>{
        fetchFinalDocumentationsBySupervisorAPI()
            .then(result =>{
                setDocuments(result)
                setLoading(false)
            })
    },[])
    return (
        <SupervisorLayout>
            {
                loading ? <LinearProgress/> :
                    <Container className={classes.container}>
                        <div className={listContainerStyles.listContainer}>
                            <div className={listContainerStyles.top}>
                                <div className={listContainerStyles.topIconBox}>
                                    <Assignment className={listContainerStyles.headerIcon}/>
                                </div>
                                <div className={listContainerStyles.topTitle}>
                                    <Typography variant='h5'>Final Documentations</Typography>
                                </div>
                            </div>
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
                                            documents.map((doc,index) => (
                                                doc.documentation.finalDocumentation.map(finalDoc => (
                                                    <TableRow key={index} className={classes.tableRow} >
                                                        <TableCell align="left">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="left">{finalDoc.document.originalname}</TableCell>
                                                        <TableCell >{finalDoc.status}</TableCell>
                                                        <TableCell align="left">{moment(finalDoc.uploadedAt).format('MMM DD, YYYY')}</TableCell>
                                                    </TableRow>
                                                ))

                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Container>
            }
        </SupervisorLayout>
    );
};


export default withSupervisorAuthSync(FinalDocumentations);