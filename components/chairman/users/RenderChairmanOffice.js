import React, {useEffect, useState} from 'react';
import {
    Avatar, Chip,
    Container,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import {useChairmanUsersStyles} from "../../../src/material-styles/chairmanUsersStyles";
import {useDrawerStyles} from "../../../src/material-styles/drawerStyles";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {Search} from "@material-ui/icons";
import {serverUrl} from "../../../utils/config";
import moment from "moment";
import RemoveUserComponent from "./RemoveUserComponent";

const RenderChairmanOffice = ({chairmanOffice}) => {
    const userClasses = useChairmanUsersStyles();
    const avatarClasses = useDrawerStyles();
    const [users,setUsers] = useState([]);
    const [filter,setFilter] = useState([]);
    const tableClasses = useTableStyles();
    const [success,setSuccess] = useState(false);
    useEffect(()=>{
        let data = [];
        chairmanOffice.map(co =>{
            co.users.map(u => {
                data = [...data,u]
            })
        });
        setUsers(data);
        setFilter(data)
    },[])
    const handleChangeSearch = e =>{
        const data = users;
        setFilter(e.target.value !==''? data.filter(office => office.name.toLowerCase().includes(e.target.value.toLowerCase())) : users)
    };

    const handleSuccess = ()=>{
        setSuccess(false);
        let data = [];
        chairmanOffice.map(co =>{
            co.users.map(u => {
                data = [...data,u]
            })
        });
        setUsers(data);
        setFilter(data)
    };
    return (
        <div >
            <SuccessSnackBar open={success} message='User Removed!' handleClose={handleSuccess}/>
            <div className={userClasses.search}>
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
            </div>
            <div className={`${tableClasses.tableWrapper} ${userClasses.table}`}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Role</TableCell>
                            <TableCell align="left">Joined At</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            filter.map((office,index) => (

                                <TableRow key={index} className={tableClasses.tableRow} >
                                    <TableCell align="left">
                                        {
                                            office.profileImage && office.profileImage.filename ?
                                                <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${office.profileImage.filename }`}  />
                                                :
                                                <Avatar className={avatarClasses.avatarColor}>
                                                    { office.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                        }
                                    </TableCell>
                                    <TableCell align="left">{office.name}</TableCell>
                                    <TableCell >{office.email}</TableCell>
                                    <TableCell >{office.role}</TableCell>
                                    <TableCell align="left">{moment(office.createdAt).format('MMM DD, YYYY')}</TableCell>
                                    <TableCell align="left">
                                        <RemoveUserComponent userId={office._id} type={office.role} setSuccess={setSuccess}/>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RenderChairmanOffice;