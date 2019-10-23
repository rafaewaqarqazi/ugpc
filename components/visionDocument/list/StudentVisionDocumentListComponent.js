import React, {useContext} from 'react';
import ProjectContext from '../../../context/project/project-context';
import {makeStyles} from "@material-ui/styles";
import { Button, Divider} from "@material-ui/core";

import Link from "next/link";
import StudentVisionListItem from "./StudentVisionListItem";


const useStyles = makeStyles(theme => ({
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
}));
const StudentVisionDocumentListComponent = () => {
    const context = useContext(ProjectContext);
    const classes = useStyles();
    return (
        <div>
            {
                (context.project.project.documentation.visionDocument.length === 0 ||
                context.project.project.documentation.visionDocument.filter(doc => doc.status === 'Rejected').length > 0) &&
                <div className={classes.listHeader}>
                    <Link href='/student/project/vision-document/new'>
                        <Button variant='outlined' color='primary'>
                            Upload New Document
                        </Button>
                    </Link>
                </div>
            }
            <Divider/>
            <StudentVisionListItem
                project={context.project.project}
            />
        </div>

    );
};

export default StudentVisionDocumentListComponent;