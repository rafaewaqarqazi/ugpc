import React, {Fragment} from 'react';
import {Avatar, Container, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@material-ui/core";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import UserAvatarComponent from "../../UserAvatarComponent";

const RenderStudents = ({students}) => {
    const classes = useDocDetailsDialogStyles();
    return (
        <div>
            <Typography variant='subtitle2'>
                Students
            </Typography>
            <Container>
                <List>
                    {
                        students.map((student,index)=>
                            <Fragment key={index}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <UserAvatarComponent user={student} />
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
                                <Divider variant="inset" component="li" />
                            </Fragment>

                        )
                    }
                </List>
            </Container>
        </div>
    );
};

export default RenderStudents;