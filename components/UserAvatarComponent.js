import React from 'react';
import {Avatar, Tooltip} from "@material-ui/core";
import {serverUrl} from "../utils/config";
import {useDrawerStyles} from "../src/material-styles/drawerStyles";

const UserAvatarComponent = ({user}) => {
    const avatarClasses = useDrawerStyles();
    return (
        <div>
            {
                user.profileImage && user.profileImage.filename ?
                    <Tooltip title={user.name} placement='top'>
                        <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${user.profileImage.filename }`}  />
                    </Tooltip>
                    :
                    <Tooltip title={user.name} placement='top'>
                        <Avatar className={avatarClasses.avatarColor}>
                            { user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Tooltip>
            }
        </div>


    );
};

export default UserAvatarComponent;