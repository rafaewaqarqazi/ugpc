import {
    Avatar,
    Chip,
    Container,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@material-ui/core";
import {getVisionDocsStatusChipColor} from "../../../src/material-styles/visionDocsListBorderColor";
import React from "react";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";

export const RenderDocBasicDetails = ({currentDocument,project}) =>{
    const classes = useDocDetailsDialogStyles();
    return (
        <div>
            <div className={classes.detailsContent}>
                <Typography variant='subtitle2'>
                    Abstract
                </Typography>
                <Typography variant='body2' className={classes.wrapText}>
                    {currentDocument.abstract}
                </Typography>
            </div>
            <div className={classes.detailsContent}>
                <Typography variant='subtitle2'>
                    Scope
                </Typography>
                <Typography variant='body2' className={classes.wrapText}>
                    {currentDocument.scope}
                </Typography>
            </div>
            <div className={classes.detailsContent}>
                <Typography variant='subtitle2'>
                    Major Modules
                </Typography>
                {
                    currentDocument.majorModules.map((module,index)=>
                        <Chip key={index} color='primary' variant='outlined' label={module}  className={classes.majorModules}/>
                    )
                }

            </div>
            <div className={classes.detailsContent}>
                <Typography variant='subtitle2'>
                    Students
                </Typography>
                {
                    project.students.map((student)=>
                        <Container key={student._id}>
                            <List>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>{student.name.charAt(0).toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={student.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    display='inline'
                                                    color="textPrimary"
                                                >
                                                    {student.department}
                                                </Typography>
                                                {` — ${student.student_details.regNo}`}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Container>
                    )
                }

            </div>
        </div>
    )
}