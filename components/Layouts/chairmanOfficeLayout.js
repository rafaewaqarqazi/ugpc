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
    Hidden,
    AppBar,
    Toolbar,
    Avatar,
    Typography
} from '@material-ui/core';
import Link from "next/link";
import {
    AssignmentTurnedInOutlined,
    AssignmentOutlined,

    ChevronLeft,
    ChevronRight,
    PermIdentity,
    ExitToAppOutlined,
} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserState from "../../context/user/UserState";

import MenuIcon from "@material-ui/icons/Menu";
import UserContext from "../../context/user/user-context";

const ChairmanOfficeLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchUserById();
    },[]);
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerOpen = ()=> {
        setOpen(true);
    };
    const handleDrawerToggle = ()=>event=>{
        setMobileOpen(!mobileOpen);
    };
    const handleDrawerClose =()=> {
        setOpen(false);
    };
    const profileMenu = (
        <div >
            <Tooltip title='Your Profile & Settings' placement='right'>
                <Avatar  onClick={event =>  setAnchorEl2(event.currentTarget)}  className={classes.avatarColor}>
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
                onClose={()=>setAnchorEl2(null)}
            >
                <div>
                    <Link href='/chairmanOffice/profile'>
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
                </div>
            </Menu>
        </div>

    );
    const drawer = (
        <Fragment>
            <List>
                <Link href='/chairmanOffice/letter/approval'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Approval Letters"} />
                    </ListItem>
                </Link>

                <Link href='/chairmanOffice/externals'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Externals"}/>
                    </ListItem>
                </Link>


            </List>
            <Divider/>
            <List>
                <Link href='/chairmanOffice/completed'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentTurnedInOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Completed"} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
    return (
        <div >
            <CssBaseline />
            <div style={{flexGrow:1}}>
                <Hidden smUp>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Hidden smUp>
                                <IconButton edge="start"  aria-label="menu" onClick={handleDrawerToggle()}>
                                    <MenuIcon style={{color:'grey'}}/>
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
                </Hidden>

            </div>

            <div className={classes.root}>
                <Hidden xsDown>
                    <Drawer
                        variant="permanent"
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            }),
                        }}
                        open={open}
                    >
                        <div className={classes.side}>
                            <div className={classes.sidebar}>
                                <div className={classes.menuRightButton}>
                                    {
                                        !open ?
                                            <Tooltip title='Expand' placement='right'>
                                                <IconButton onClick={handleDrawerOpen} style={{color:'#fff'}}>
                                                    <ChevronRight color='inherit'/>
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <div className={classes.blank}/>

                                    }
                                </div>

                                <div className={classes.menus}>
                                    <div className={classes.menuRightTopContent} style={{flexGrow:1}}>
                                        <div >
                                            <Tooltip title='UGPC-Software' placement='right'>
                                                <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatarMargin}/>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className={classes.menuRightTopContent}>
                                        {profileMenu}
                                    </div>

                                </div>
                            </div>
                            <div className={classes.list}>
                                <div className={classes.toolbar}>
                                    <div style={{flexGrow:1}}/>
                                    {
                                        open &&
                                        <Tooltip title='Collapse' placement='right'>
                                            <IconButton onClick={handleDrawerClose}>
                                                <ChevronLeft />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </div>
                                <Divider />

                                {drawer}

                            </div>
                        </div>
                    </Drawer>
                    <main className={classes.content}>
                        <UserState>
                            {children}
                        </UserState>
                    </main>
                </Hidden>
            </div>


        </div>
    );
};
export default ChairmanOfficeLayout;