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
    MenuItem,
    Avatar,
    Typography, Hidden, AppBar, Toolbar, InputLabel, Select, OutlinedInput, FormControl
} from '@material-ui/core';

import Link from "next/link";
import {
    Dashboard,
    SupervisorAccountOutlined,
    SupervisorAccount,
    Visibility,
    Assignment,
    Schedule
} from "@material-ui/icons";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import MenuIcon from '@material-ui/icons/Menu';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
import AddMenu from "./AddMenu";
import DrawerLayout from "./DrawerLayout";
import DrawerLink from "./DrawerLink";
import {useSwitchStyles} from "../../src/material-styles/selectSwitchStyles";
import MobileDrawer from "./MobileDrawer";

const CoordinatorLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{userContext.fetchUserById()},[]);
    const classes = useDrawerStyles();
    const switchClasses = useSwitchStyles();
    const [open, setOpen] = useState(true);
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

    const drawerContent = (
        <Fragment>
            <List>
                <DrawerLink href={'/committee/defence/coordinator/dashboard'}>
                    <ListItemIcon>
                        <Dashboard className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </DrawerLink>
                <DrawerLink href={'/committee/defence/coordinator/supervisors'}>
                    <ListItemIcon>
                        <SupervisorAccount className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Supervisors"} />
                </DrawerLink>
            </List>
            <Divider/>
            <List>
                <DrawerLink href={'/committee/defence/coordinator/vision-documents'}>
                    <ListItemIcon>
                        <Assignment className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Vision Documents"}  style={{whiteSpace:'normal'}} />
                </DrawerLink>
                <DrawerLink href={'/committee/defence/coordinator/presentations'}>
                    <ListItemIcon>
                        <Schedule className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Schedule Presentations"} style={{whiteSpace:'normal'}} />
                </DrawerLink>
                <DrawerLink href={'/committee/defence/coordinator/meetings'}>
                    <ListItemIcon>
                        <Visibility className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Meetings"} />
                </DrawerLink>
            </List>
        </Fragment>

    );
    const handleAddPresentationClick = ()=>{
        Router.push('/committee/defence/coordinator/presentations');
    };
    const addMenuContent = (
            <MenuItem onClick={handleAddPresentationClick}>
                <ListItemIcon>
                    <SupervisorAccountOutlined />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Presentation
                </Typography>
            </MenuItem>
    );

    const handleClickProfile = ()=>{
        Router.push('/committee/defence/coordinator/profile');
    };
    const accountSwitch = (
        userContext.user.isLoading ? <div style={{flexGrow:1}} /> : userContext.user.user.role === 'Supervisor' ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch" className={classes.iconColor}>
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    className={classes.iconColor}
                    value={userContext.user.user.ugpc_details.position}
                    input={<OutlinedInput classes={switchClasses} labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize:14}}>Coordinator View</MenuItem>
                    <MenuItem value='Supervisor View' style={{fontSize:14}}>
                        <Link href='/supervisor/projects'>
                            <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                        </Link>
                    </MenuItem>


                </Select>
            </FormControl>
            :
            <div style={{flexGrow:1}} />
    );
    return (
        <div >
            <CssBaseline />
            <div style={{flexGrow:1}}>
                <Hidden smUp>
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
                            <AddMenu addMenuContent={addMenuContent}/>
                            <ProfileMenu handleClickProfile={handleClickProfile}/>
                        </Toolbar>
                    </AppBar>
                    <nav  aria-label="mailbox folders">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp >
                            <MobileDrawer
                                drawerContent={drawerContent}
                                accountSwitch={accountSwitch}
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
                    <AppBarWithAddMenu open={open} addMenuContent={addMenuContent} handleClickProfile={handleClickProfile}/>
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
                            open={open}
                            handleDrawerOpen={handleDrawerOpen}
                            handleDrawerClose={handleDrawerClose}
                            drawerContent={drawerContent}
                            accountSwitch={accountSwitch}
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
export default CoordinatorLayout;