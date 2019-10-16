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
    MenuItem,
    Avatar,
    Hidden,
    AppBar,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput, Menu,
} from '@material-ui/core';

import Link from "next/link";
import {
    Laptop,
    ChevronLeft,
    ChevronRight,
    Assignment
} from "@material-ui/icons";

import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import MenuIcon from '@material-ui/icons/Menu';

import Router, {useRouter} from 'next/router';
import ProfileMenu from "../profile/ProfileMenu";
import {serverUrl} from "../../utils/config";
import {useSwitchStyles} from "../../src/material-styles/selectSwitchStyles";
import DrawerLayout from "./DrawerLayout";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
import MobileDrawer from "./MobileDrawer";


const SupervisorLayout = ({children})=> {
    const router = useRouter();
    const switchClasses = useSwitchStyles();
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
    const handleDrawerClose =()=> {
        setOpen(false);
    };
    const handleDrawerToggle = ()=>event=>{
        setMobileOpen(!mobileOpen);
    };
    const drawerContent = (
        <Fragment>
            <List>
                <Link href='/supervisor/projects'>
                    <ListItem button className={router.pathname === '/supervisor/projects' ? classes.drawerListItemActive : classes.drawerListItem}>
                        <ListItemIcon>
                            <Laptop className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Projects"} />
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List>
                <Link href='/supervisor/documentation'>
                    <ListItem button className={router.pathname === '/supervisor/documentation' ? classes.drawerListItemActive : classes.drawerListItem}>
                        <ListItemIcon>
                            <Assignment className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Documentation"}  style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
    const handleClickProfile = ()=>{
        Router.push('/supervisor/profile')
    };

    const accountSwitch = (
        userContext.user.isLoading ? <div /> : userContext.user.user.additionalRole ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch" className={classes.iconColor}>
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    className={classes.iconColor}
                    value={userContext.user.user.role}
                    input={<OutlinedInput labelWidth={67}  classes={switchClasses} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value={userContext.user.user.role} style={{fontSize:14}}>Supervisor View</MenuItem>
                    {
                        userContext.user.user.additionalRole && userContext.user.user.ugpc_details.position === 'Coordinator' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/defence/coordinator/dashboard'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Coordinator View</a>
                            </Link>
                        </MenuItem>
                    }
                    {
                        userContext.user.user.additionalRole &&
                        userContext.user.user.ugpc_details.position === 'Member' &&
                        userContext.user.user.ugpc_details.committeeType === 'Defence' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/defence/member'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Committee View</a>
                            </Link>
                        </MenuItem>
                    }
                    {
                        userContext.user.user.additionalRole &&
                        userContext.user.user.ugpc_details.position === 'Member' &&
                        userContext.user.user.ugpc_details.committeeType === 'Evaluation' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/evaluation/member'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Committee View</a>
                            </Link>
                        </MenuItem>
                    }
                    {
                        userContext.user.user.additionalRole &&
                        userContext.user.user.ugpc_details.position === 'Chairman_Committee' &&
                        userContext.user.user.ugpc_details.committeeType === 'Defence' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/defence/chairman'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Chairman Committee View</a>
                            </Link>
                        </MenuItem>
                    }
                    {
                        userContext.user.user.additionalRole &&
                        userContext.user.user.ugpc_details.position === 'Chairman_Committee' &&
                        userContext.user.user.ugpc_details.committeeType === 'Evaluation' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/evaluation/chairman'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Chairman Committee View</a>
                            </Link>
                        </MenuItem>
                    }
                </Select>
            </FormControl>
            :
            <div />
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
                            <ProfileMenu handleClickProfile={handleClickProfile}/>
                        </Toolbar>
                    </AppBar>
                    <nav  aria-label="mailbox folders">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp >
                            <MobileDrawer
                                mobileOpen={mobileOpen}
                                handleDrawerToggle={handleDrawerToggle}
                                drawerContent={drawerContent}
                                accountSwitch={accountSwitch}
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
export default SupervisorLayout;