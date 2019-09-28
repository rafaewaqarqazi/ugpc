import React, {Fragment, useContext, useEffect, useState} from 'react';
import clsx from 'clsx';

import {
    Drawer,
    List,
    CssBaseline,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    Menu,
    MenuItem,
    Avatar,
    Typography,
    Hidden,
    AppBar,
    Toolbar,
} from '@material-ui/core';

import Link from "next/link";
import {
    DashboardOutlined,
    Laptop,
    ChevronLeft,
    ChevronRight,
    PermIdentity,
    ExitToAppOutlined, AssignmentOutlined,
} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import MenuIcon from '@material-ui/icons/Menu';

const EvaluationChairmanLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchUserById();
    },[]);
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerOpen = ()=> {
        setOpen(true);
    };
    const handleDrawerClose =()=> {
        setOpen(false);
    };
    const handleDrawerToggle = ()=>event=>{
        setMobileOpen(!mobileOpen);
    };
    const drawer = (
        <Fragment>
            <List>
                <Link href='/supervisor/dashboard'>
                    <ListItem button >
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItem>

                </Link>

                <Link href='/supervisor/projects'>
                    <ListItem button >
                        <ListItemIcon>
                            <Laptop />
                        </ListItemIcon>
                        <ListItemText primary={"Projects"} />
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List>
                <Link href='/supervisor/documentation'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Documentation"}  style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
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
    return (
        <div >
            <CssBaseline />
            <div style={{flexGrow:1}}>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Hidden smUp>
                                <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu" onClick={handleDrawerToggle()}>
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>
                            <div style={{flexGrow:1}}>
                                <Tooltip title='UGPC-Software' placement='right'>
                                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" />
                                </Tooltip>
                            </div>
                            {profileMenu}
                        </Toolbar>
                    </AppBar>
                    <nav  aria-label="mailbox folders">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp >
                            <Drawer
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle()}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                            >
                                <div style={{width:240}}>
                                    <div className={classes.avatarDrawer}>
                                        <Avatar  className={classes.avatarSize}>{!userContext.user.isLoading ? userContext.user.user.name.charAt(0).toUpperCase() : 'U' }</Avatar>
                                    </div>
                                    <Divider/>
                                    {drawer}
                                </div>

                            </Drawer>
                        </Hidden>
                    </nav>
                    <div>
                        {children}
                    </div>
            </div>

        </div>
    );
};
export default EvaluationChairmanLayout;