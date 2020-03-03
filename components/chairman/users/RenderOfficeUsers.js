import React, {useEffect, useState} from 'react';
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
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";

const RenderOfficeUsers = ({chairmanOffice}) => {
  const userClasses = useChairmanUsersStyles();
  const avatarClasses = useDrawerStyles();

  const [users, setUsers] = useState(chairmanOffice || []);
  const [filter, setFilter] = useState(chairmanOffice || []);
  const tableClasses = useTableStyles();
  const emptyStyles = useListItemStyles();
  const [success, setSuccess] = useState(false);
  const handleChangeSearch = e => {
    const data = users;
    setFilter(e.target.value !== '' ? data.filter(office => office.name.toLowerCase().includes(e.target.value.toLowerCase())) : users)
  };

  const handleSuccess = () => {
    setSuccess(false);
    setUsers(chairmanOffice || []);
    setFilter(chairmanOffice || [])
  };
  return (
    <div>
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
                <Search/>
              </InputAdornment>
            ),
          }}
        />
        <Typography className={userClasses.userNumbers} variant='body2'
                    color='textSecondary'>{filter.length} {filter.length === 1 ? 'User' : 'Users'} Found</Typography>
      </div>
      <div className={`${tableClasses.tableWrapper} ${userClasses.table}`}>
        <Table>
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
          <TableBody>
            {
              filter.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className={emptyStyles.emptyListContainer}>
                      <div className={emptyStyles.emptyList}>
                        No User Found
                      </div>
                    </div>
                  </TableCell>
                </TableRow> :
                filter.map((office, index) => (

                  <TableRow key={index} className={tableClasses.tableRow}>
                    <TableCell align="left">
                      {
                        office.profileImage && office.profileImage.filename ?
                          <Avatar className={avatarClasses.imageAvatar}
                                  src={`${serverUrl}/../images/${office.profileImage.filename}`}/>
                          :
                          <Avatar className={avatarClasses.avatarColor}>
                            {office.name.charAt(0).toUpperCase()}
                          </Avatar>
                      }
                    </TableCell>
                    <TableCell align="left">{office.name}</TableCell>
                    <TableCell>{office.email}</TableCell>
                    <TableCell>{office.role}</TableCell>
                    <TableCell align="left">{moment(office.createdAt).format('MMM DD, YYYY')}</TableCell>
                    <TableCell align="left">
                      <RemoveUserComponent userId={office._id} setSuccess={setSuccess}/>
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

export default RenderOfficeUsers;