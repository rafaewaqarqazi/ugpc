import React, {useContext} from 'react';
import TitleComponent from "../../title/TitleComponent";
import ProjectContext from '../../../context/project/project-context';


import {makeStyles} from "@material-ui/styles";
import {Box, Button, Container, Divider, LinearProgress} from "@material-ui/core";
import {Assignment} from "@material-ui/icons";
import Link from "next/link";
import StudentVisionListItem from "./StudentVisionListItem";

const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    },
    listContainer:{
        padding:theme.spacing(2),
        marginTop: theme.spacing(8),
    },
    top:{
        width: theme.spacing(11),
        height:theme.spacing(11),
        backgroundColor: theme.palette.secondary.dark,
        color:'#fff',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center',
        marginTop:-theme.spacing(5),
        marginBottom:theme.spacing(5)
    },
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },

}));
const VisionDocumentListComponent = () => {
    const context = useContext(ProjectContext);
    const classes = useStyles();
    return (
        <div>
            <TitleComponent title='Your Vision Docs'/>
            {context.project.isLoading ? <LinearProgress /> :
                <Container className={classes.container}>
                    <Box boxShadow={10} className={classes.listContainer}>
                        <Box boxShadow={10} className={classes.top}>
                            <Assignment fontSize='large'/>
                        </Box>
                        <Box boxShadow={3} p={2}>
                            <div className={classes.listHeader}>
                                <Link href='/student/project/vision-document/new'>
                                    <Button variant='outlined' color='primary'>
                                        Upload New Document
                                    </Button>
                                </Link>
                            </div>
                            <Divider/>
                            <StudentVisionListItem
                                visionDocuments={context.project.project[0].documentation.visionDocument}
                                projectTitle={context.project.project[0].title}
                                students={context.project.project[0].students}
                                projectId={context.project.project[0]._id}
                            />
                        </Box>
                    </Box>
                </Container>

            }
        </div>
    );
};

export default VisionDocumentListComponent;