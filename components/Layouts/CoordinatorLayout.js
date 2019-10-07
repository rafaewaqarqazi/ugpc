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
    Typography, Hidden, AppBar, Toolbar, InputLabel, Select, OutlinedInput, FormControl
} from '@material-ui/core';

import Link from "next/link";
import {
    DashboardOutlined,
    Laptop,
    SupervisorAccountOutlined,
    VisibilityOutlined,
    ChevronLeft,
    ChevronRight,
    Add,
    PermIdentity,
    ExitToAppOutlined,
    ScheduleOutlined,
    SettingsOutlined
} from "@material-ui/icons";
import { signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import MenuIcon from '@material-ui/icons/Menu';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";

const CoordinatorLayout = ({children})=> {
    const userContext = useContext(UserContext);
    useEffect(()=>{userContext.fetchUserById()},[])
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerOpen = ()=> {
        setOpen(true);
    };

    const handleDrawerClose =()=> {
        setOpen(false);
    };
    const handleAddMenuClose = ()=>{
        setAnchorEl(null);
    };
    const handleAddMenuClick = event =>{
        setAnchorEl(event.currentTarget)
    };


    const handleProfileMenuClose = ()=>{
        setAnchorEl2(null);
    };
    const handleProfileMenuClick = event =>{
        setAnchorEl2(event.currentTarget)
    };
    const handleDrawerToggle = ()=>event=>{
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Fragment>
            <List>
                <Link href='/committee/defence/coordinator/overview'>
                    <ListItem button >
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Overview"} />
                    </ListItem>

                </Link>

                <Link href='/committee/defence/coordinator/vision-documents'>
                    <ListItem button >
                        <ListItemIcon>
                            <Laptop />
                        </ListItemIcon>
                        <ListItemText primary={"Vision Documents"}  style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>

                <Link href='/committee/defence/coordinator/projects'>
                    <ListItem button >
                        <ListItemIcon>
                            <Laptop />
                        </ListItemIcon>
                        <ListItemText primary={"Projects"} />
                    </ListItem>
                </Link>

                <Link href='/committee/defence/coordinator/presentations'>
                    <ListItem button >
                        <ListItemIcon>
                            <ScheduleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Schedule Presentations"} style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>

                <Link href='/committee/defence/coordinator/meetings'>
                    <ListItem button >
                        <ListItemIcon>
                            <VisibilityOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Meetings"} />
                    </ListItem>
                </Link>

                <Link href='/committee/defence/coordinator/supervisors'>
                    <ListItem button >
                        <ListItemIcon>
                            <SupervisorAccountOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Supervisors"} />
                    </ListItem>
                </Link>

            </List>
            <Divider/>
            <List>
                <Link href='/committee/defence/coordinator/settings'>
                    <ListItem button >
                        <ListItemIcon>
                            <SettingsOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Settings"} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
    const addMenu = (
        <Link href='/committee/defence/coordinator/presentation'>
            <MenuItem>
                <ListItemIcon>
                    <SupervisorAccountOutlined />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Presentation
                </Typography>
            </MenuItem>
        </Link>
    );
    const handleClickProfile = ()=>{
        Router.push('/committee/defence/coordinator/profile');
    };
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
                            <Tooltip title='Add' placement='right'>
                                <IconButton onClick={handleAddMenuClick}  size='small'>
                                    <Add/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleAddMenuClose}
                            >
                                {addMenu}
                            </Menu>
                            <ProfileMenu handleClickProfile={handleClickProfile}/>
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
                                        <Avatar  className={`${classes.avatarSize} ${classes.avatarColor}`}>{!userContext.user.isLoading ? userContext.user.user.name.charAt(0).toUpperCase() : 'U' }</Avatar>
                                    </div>
                                    <div className={classes.avatarDrawer}>
                                        {
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
                                                        <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize:14}}>Coordinator View</MenuItem>
                                                        <MenuItem value='Supervisor View' style={{fontSize:14}}>
                                                            <Link href='/supervisor/dashboard'>
                                                                <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                                                            </Link>
                                                        </MenuItem>


                                                    </Select>
                                                </FormControl>
                                                :
                                                <div/>
                                        }
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
                                        <div>
                                            <Tooltip title='Add' placement='right'>
                                                <IconButton onClick={handleAddMenuClick} style={{color:'#fff'}} size='small' >
                                                    <Add/>
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                id="add-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleAddMenuClose}
                                            >
                                                {addMenu}
                                            </Menu>
                                        </div>
                                    </div>

                                    <div className={classes.menuRightTopContent}>
                                        <ProfileMenu handleClickProfile={handleClickProfile}/>
                                    </div>
                                </div>




                            </div>
                            <div className={classes.list}>
                                <div className={classes.toolbar}>
                                    {
                                        userContext.user.isLoading ? <div style={{flexGrow:1}} /> : userContext.user.user.role === 'Supervisor' ?
                                        <FormControl variant="outlined" margin='dense' >
                                            <InputLabel htmlFor="accountSwitch">
                                                Switch to
                                            </InputLabel>
                                            <Select
                                                style={{fontSize:12}}
                                                value={userContext.user.user.ugpc_details.position}
                                                input={<OutlinedInput  labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                                            >
                                                <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize:14}}>Coordinator View</MenuItem>
                                                <MenuItem value='Supervisor View' style={{fontSize:14}}>
                                                    <Link href='/supervisor/dashboard'>
                                                        <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                                                    </Link>
                                                </MenuItem>


                                            </Select>
                                        </FormControl>
                                            :
                                            <div style={{flexGrow:1}} />
                                    }
                                    {
                                        open &&
                                        <Tooltip title='Collapse' placement='right'>
                                            <IconButton onClick={handleDrawerClose} >
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
                        {children}
                    </main>
                </Hidden>
            </div>
        </div>
    );
};
export default CoordinatorLayout;