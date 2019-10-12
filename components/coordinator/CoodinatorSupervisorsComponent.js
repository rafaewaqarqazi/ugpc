import React from 'react';
import {Close, Delete, MoreVertOutlined, SupervisorAccountOutlined} from "@material-ui/icons";
import {
    Avatar,
    Chip,
    Container, IconButton, ListItemIcon, Menu, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@material-ui/core";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import CircularLoading from "../loading/CircularLoading";
import {serverUrl} from "../../utils/config";
import {useTableStyles} from "../../src/material-styles/tableStyles";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";

const CoordinatorSupervisorsComponent = ({supervisors}) => {
    const tableClasses = useTableStyles();
    const avatarClasses = useDrawerStyles();
    const emptyStyles = useListItemStyles();
    const classes = useListContainerStyles();
    return (
        <div>
            <Container>
                <div className={classes.listContainer} >
                    <div className={classes.top}>
                        <div className={classes.topIconBox} >
                            <SupervisorAccountOutlined className={classes.headerIcon}/>
                        </div>
                        <div className={classes.topTitle} >
                            <Typography variant='h5' style={{textTransform:"capitalize"}} color='textSecondary'>Supervisors</Typography>
                        </div>
                    </div>


                    {
                        supervisors.isLoading ? <CircularLoading/> :
                            <div>
                                {
                                    supervisors.supervisors.length === 0 ?
                                        <div className={emptyStyles.emptyListContainer} >
                                            <div className={emptyStyles.emptyList}>
                                                No Member Found
                                            </div>
                                        </div>:

                                        <div className={tableClasses.tableWrapper}>

                                            <Table size='small'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left"></TableCell>
                                                        <TableCell align="left">Name</TableCell>
                                                        <TableCell align="left">Email</TableCell>
                                                        <TableCell align="left">Position</TableCell>
                                                        <TableCell align="left">Projects</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody >
                                                    {
                                                        supervisors.supervisors.map((supervisor,index) => (

                                                            <TableRow key={index} className={tableClasses.tableRow} >
                                                                <TableCell align="left">
                                                                    {
                                                                        supervisor.profileImage && supervisor.profileImage.filename ?
                                                                            <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${supervisor.profileImage.filename }`}  />
                                                                            :
                                                                            <Avatar className={avatarClasses.avatarColor}>
                                                                                { supervisor.name.charAt(0).toUpperCase()}
                                                                            </Avatar>
                                                                    }
                                                                </TableCell>
                                                                <TableCell align="left">{supervisor.name}</TableCell>
                                                                <TableCell >{supervisor.email}</TableCell>
                                                                <TableCell >
                                                                    <Chip
                                                                        label={supervisor.supervisor_details.position}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="left">{supervisor.supervisor_details.projects.length}</TableCell>

                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </div>
                                }
                            </div>
                    }


                </div>
            </Container>
        </div>
    );
};

export default CoordinatorSupervisorsComponent;