import React, {Fragment, useContext, useEffect, useState} from 'react';
import clsx from 'clsx';

import {
    Drawer,
    List,
    CssBaseline,
    Divider,
    IconButton,
    ListItemText,
    ListItemIcon,
    Tooltip,
    Hidden,
    AppBar,
    Toolbar,
    Avatar,
} from '@material-ui/core';
import {
    AssignmentTurnedIn,
    Assignment,
} from "@material-ui/icons";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import MenuIcon from "@material-ui/icons/Menu";
import UserContext from "../../context/user/user-context";
import ProfileMenu from "../profile/ProfileMenu";
import Router from 'next/router';
import DrawerLink from "./DrawerLink";
import MobileDrawer from "./MobileDrawer";
import DrawerLayout from "./DrawerLayout";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
const ChairmanOfficeLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchUserById();
    },[]);
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
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
    const handleClickProfile = ()=>{
        Router.push('/chairmanOffice/profile');
    };
    const drawerContent = (
        <Fragment>
            <List>
                <DrawerLink href='/chairmanOffice/letter/approval'>
                    <ListItemIcon>
                        <Assignment className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Approval Letters"} />
                </DrawerLink>
                <DrawerLink href='/chairmanOffice/externals'>
                    <ListItemIcon>
                        <Assignment className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Externals"}/>
                </DrawerLink>
            </List>
            <Divider/>
            <List>
                <DrawerLink href='/chairmanOffice/completed'>
                    <ListItemIcon>
                        <AssignmentTurnedIn className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Completed"} />
                </DrawerLink>
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
                                    <Avatar alt="IIUI-LOGO" src="/static/avatar/avatar/iiui-logo.jpg" />
                                </Tooltip>
                            </div>

                           <ProfileMenu handleClickProfile={handleClickProfile}/>
                        </Toolbar>
                    </AppBar>
                    <nav  aria-label="mailbox folders">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp >
                            <MobileDrawer
                                drawerContent={drawerContent}
                                mobileOpen={mobileOpen}
                                handleDrawerToggle={handleDrawerToggle}
                                />
                        </Hidden>
                    </nav>
                    <div>
                        {children}
                    </div>
                </Hidden>

            </div>

            <div className={classes.root}>
                <Hidden xsDown>
                    <AppBarWithAddMenu open={open} handleClickProfile={handleClickProfile}/>
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
                        <DrawerLayout
                            drawerContent={drawerContent}
                            open={open}
                            handleDrawerOpen={handleDrawerOpen}
                            handleDrawerClose={handleDrawerClose}
                            />
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
                        {children}
                    </main>
                </Hidden>
            </div>


        </div>
    );
};
export default ChairmanOfficeLayout;