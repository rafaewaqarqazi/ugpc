import React, {useEffect, useState} from 'react';
import { Search, SupervisorAccountOutlined} from "@material-ui/icons";
import {
    Avatar,
    Chip,
    Container, InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TextField,
    Divider,
    Typography
} from "@material-ui/core";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import CircularLoading from "../loading/CircularLoading";
import {serverUrl} from "../../utils/config";
import {useTableStyles} from "../../src/material-styles/tableStyles";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";
import {useChairmanUsersStyles} from "../../src/material-styles/chairmanUsersStyles";

const CoordinatorSupervisorsComponent = ({supervisors}) => {
    const userClasses = useChairmanUsersStyles();
    const tableClasses = useTableStyles();
    const avatarClasses = useDrawerStyles();
    const emptyStyles = useListItemStyles();
    const classes = useListContainerStyles();
    const [filter,setFilter] = useState([]);

    useEffect(()=>{
        setFilter(supervisors.supervisors)
    },[supervisors.supervisors]);
    const handleChangeSearch = e =>{
        const data = supervisors.supervisors;
        setFilter(e.target.value !==''? data.filter(office => office.name.toLowerCase().includes(e.target.value.toLowerCase())) : supervisors.supervisors)
    };
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
                    <div className={userClasses.header}>
                        <TextField
                            variant="outlined"
                            label="Search"
                            margin='dense'
                            placeholder='Search'
                            onChange={handleChangeSearch}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Typography className={userClasses.userNumbers} variant='body2' color='textSecondary'>{filter.length} {filter.length === 1 ? 'Supervisor' : 'Supervisors'} Found</Typography>
                    </div>
                    <Divider/>
                    {
                        supervisors.isLoading ? <CircularLoading/> :
                            <div>


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

                                                        <TableBody>
                                                            {
                                                                filter.length === 0 ?
                                                                    <TableRow>
                                                                        <TableCell colSpan={5}>
                                                                            <div className={emptyStyles.emptyListContainer}>
                                                                                <div className={emptyStyles.emptyList}>
                                                                                    No Supervisor Found
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>:
                                                                        filter.map((supervisor, index) => (

                                                                            <TableRow key={index}
                                                                                      className={tableClasses.tableRow}>
                                                                                <TableCell align="left">
                                                                                    {
                                                                                        supervisor.profileImage && supervisor.profileImage.filename ?
                                                                                            <Avatar
                                                                                                className={avatarClasses.imageAvatar}
                                                                                                src={`${serverUrl}/../static/images/${supervisor.profileImage.filename}`}/>
                                                                                            :
                                                                                            <Avatar
                                                                                                className={avatarClasses.avatarColor}>
                                                                                                {supervisor.name.charAt(0).toUpperCase()}
                                                                                            </Avatar>
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="left">{supervisor.name}</TableCell>
                                                                                <TableCell>{supervisor.email}</TableCell>
                                                                                <TableCell>
                                                                                    <Chip
                                                                                        label={supervisor.supervisor_details.position}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="left">{supervisor.supervisor_details.projects.length}</TableCell>

                                                                            </TableRow>
                                                                        ))

                                                            }
                                                        </TableBody>

                                            </Table>
                                        </div>

                            </div>
                    }


                </div>
            </Container>
        </div>
    );
};

export default CoordinatorSupervisorsComponent;