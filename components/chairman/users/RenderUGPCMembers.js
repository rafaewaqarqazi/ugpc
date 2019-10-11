import React, {useState} from 'react';
import {
    Avatar,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {useChairmanUsersStyles} from "../../../src/material-styles/chairmanUsersStyles";
import {useDrawerStyles} from "../../../src/material-styles/drawerStyles";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import {Search} from "@material-ui/icons";
import {serverUrl} from "../../../utils/config";
import moment from "moment";
import RemoveUserComponent from "./RemoveUserComponent";

const RenderUgpcMembers = ({ugpcMembers}) => {
    const userClasses = useChairmanUsersStyles();
    const avatarClasses = useDrawerStyles();
    const [filter,setFilter] = useState(ugpcMembers ? ugpcMembers.users : []);
    const tableClasses = useTableStyles();
    const [success,setSuccess] = useState(false);
    const handleChangeSearch = e =>{
        const data = ugpcMembers.users;
        setFilter(e.target.value !==''? data.filter(ugpcMember => ugpcMember.name.toLowerCase().includes(e.target.value.toLowerCase())) : ugpcMembers.users)
    };

    const handleSuccess = ()=>{
        setSuccess(false);
        setFilter(ugpcMembers.users);
    };
    return (
        <div >
            <SuccessSnackBar open={success} message='User Removed!' handleClose={handleSuccess}/>
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
                <Typography className={userClasses.userNumbers} variant='body2' color='textSecondary'>{filter.length} {filter.length === 1 ? 'User' : 'Users'} Found</Typography>
            </div>
            <div className={`${tableClasses.tableWrapper} ${userClasses.table}`}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Committee</TableCell>
                            <TableCell align="left">For</TableCell>
                            <TableCell align="left">Position</TableCell>
                            <TableCell align="left">Joined At</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            filter.map((ugpcMember,index) => (

                                <TableRow key={index} className={tableClasses.tableRow} >
                                    <TableCell align="left">
                                        {
                                            ugpcMember.profileImage && ugpcMember.profileImage.filename ?
                                                <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${ugpcMember.profileImage.filename }`}  />
                                                :
                                                <Avatar className={avatarClasses.avatarColor}>
                                                    { ugpcMember.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                        }
                                    </TableCell>
                                    <TableCell align="left">{ugpcMember.name}</TableCell>
                                    <TableCell >{ugpcMember.email}</TableCell>
                                    <TableCell >{ugpcMember.ugpc_details.committeeType}</TableCell>
                                    <TableCell >{ugpcMember.ugpc_details.committees.map((committee,index) => `${committee}${index > 1 ? ',':''}`)}</TableCell>
                                    <TableCell >{ugpcMember.ugpc_details.position}</TableCell>
                                    <TableCell align="left">{moment(ugpcMember.createdAt).format('MMM DD, YYYY')}</TableCell>
                                    <TableCell align="left">
                                        <RemoveUserComponent userId={ugpcMember._id} type={ugpcMember._id} setSuccess={setSuccess}/>
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

export default RenderUgpcMembers;