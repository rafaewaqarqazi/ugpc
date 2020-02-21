import React, {useContext} from 'react';
import {Avatar, ListItemIcon, Menu, MenuItem, Tooltip, Typography} from "@material-ui/core";
import {serverUrl} from "../../utils/config";
import {ExitToAppOutlined, PermIdentity} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from "../../context/user/user-context";

const ProfileMenu = ({handleClickProfile}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userContext = useContext(UserContext);
  const classes = useDrawerStyles();
  return (
    <div>
      <Tooltip title='Your Profile & Settings' placement='right'>
        {
          userContext.user.isLoading ?
            <Avatar onClick={event => setAnchorEl(event.currentTarget)} className={classes.profileAvatarColor}>
              U
            </Avatar>
            :
            userContext.user.user.profileImage.filename ?
              <Avatar onClick={event => setAnchorEl(event.currentTarget)}
                      src={`${serverUrl}/../static/images/${userContext.user.user.profileImage.filename}`}/>
              :
              <Avatar onClick={event => setAnchorEl(event.currentTarget)} className={classes.profileAvatarColor}>
                {userContext.user.user.name.charAt(0).toUpperCase()}
              </Avatar>
        }
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >

        <MenuItem onClick={handleClickProfile}>
          <ListItemIcon>
            <PermIdentity/>
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Profile
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => signout()}>
          <ListItemIcon>
            <ExitToAppOutlined/>
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Sign Out
          </Typography>
        </MenuItem>
      </Menu>

    </div>
  );
};

export default ProfileMenu;