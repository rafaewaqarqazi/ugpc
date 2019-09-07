import React, {useContext} from 'react';
import ProjectContext from '../../../context/project/project-context';
import {makeStyles} from "@material-ui/styles";
import {Box, Button, Container, Divider, LinearProgress} from "@material-ui/core";
import {Assignment} from "@material-ui/icons";
import Link from "next/link";
import StudentVisionListItem from "./StudentVisionListItem";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import Typography from "@material-ui/core/Typography";
import VisionDocListItem from "../higherAuthority/list/VisionDocListItem";

const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(5),
    },
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
}));
const VisionDocumentListComponent = () => {
    const context = useContext(ProjectContext);
    const classes = useStyles();
    const listContainerStyles = useListContainerStyles();
    return (
        <div>
            {context.project.isLoading ? <LinearProgress /> :
                <Container className={classes.container}>
                    <div className={listContainerStyles.listContainer}>
                        <div className={listContainerStyles.top}>
                            <div className={listContainerStyles.topIconBox}>
                                <Assignment className={listContainerStyles.headerIcon}/>
                            </div>
                            <div className={listContainerStyles.topTitle}>
                                <Typography variant='h5'>Vision Documents</Typography>
                            </div>
                        </div>
                        <div className={classes.listHeader}>
                            <Link href='/student/project/vision-document/new'>
                                <Button variant='outlined' color='primary'>
                                    Upload New Document
                                </Button>
                            </Link>
                        </div>
                        <Divider/>

                        <StudentVisionListItem
                            project={context.project.project[0]}
                        />
                    </div>
                </Container>

            }
        </div>
    );
};

export default VisionDocumentListComponent;