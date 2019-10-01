import React, {useContext, useEffect} from 'react';

import {
    CssBaseline,
    ListItemIcon,
    Tooltip,
    Menu,
    MenuItem,
    Avatar,
    Typography,
    AppBar,
    Toolbar,
    FormControl,
    InputLabel,
    OutlinedInput,
    Select
} from '@material-ui/core';

import Link from "next/link";
import {
    PermIdentity,
    ExitToAppOutlined,
} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';


const CommitteeMemberLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchUserById();
    },[]);
    const classes = useDrawerStyles();
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const profileMenu = (
        <div>
            <Tooltip title='Your Profile & Settings' placement='right'>
                <Avatar  onClick={event => setAnchorEl2(event.currentTarget)} className={classes.avatarColor}>
                    {
                        !userContext.user.isLoading ? userContext.user.user.name.charAt(0).toUpperCase() : 'U'
                    }
                </Avatar>
            </Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={()=> setAnchorEl2(null)}
            >
                <Link href='/user/profile'>
                    <MenuItem>
                        <ListItemIcon>
                            <PermIdentity />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Profile
                        </Typography>
                    </MenuItem>
                </Link>
                <MenuItem onClick={()=>signout()}>
                    <ListItemIcon>
                        <ExitToAppOutlined />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Sign Out
                    </Typography>
                </MenuItem>

            </Menu>
        </div>


    );
    const accountSwitch = (
        userContext.user.isLoading ? <div /> : userContext.user.user.role === 'Supervisor' ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch">
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    value={userContext.user.user.ugpc_details.position}
                    autoWidth
                    input={<OutlinedInput  labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize:14}}>Evaluation Committee View</MenuItem>
                    <MenuItem value='Supervisor View' style={{fontSize:14}}>
                        <Link href='/supervisor/dashboard'>
                            <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                        </Link>
                    </MenuItem>
                </Select>
            </FormControl>
            :
            <div/>
    );
    return (
        <div >
            <CssBaseline />
            <div style={{flexGrow:1}}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <div style={{marginRight:10}}>
                            <Tooltip title='UGPC-Software' placement='right'>
                                <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" style={{cursor:'pointer'}}/>
                            </Tooltip>
                        </div>
                        <div style={{flexGrow:1}}>
                            {accountSwitch}
                        </div>

                        {profileMenu}
                    </Toolbar>
                </AppBar>
                <div>
                    {children}
                </div>
            </div>

        </div>
    );
};
export default CommitteeMemberLayout;