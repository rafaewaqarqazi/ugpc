import React, {useState, useContext, useEffect, Fragment} from 'react';

import {
    CssBaseline, Divider, Drawer,
    IconButton, List, ListItemText,
    ListItem, ListItemIcon,
    Avatar, Tooltip, Menu,
    MenuItem,
    Hidden, Toolbar, Button, AppBar
} from '@material-ui/core';
import {ListAltOutlined, ChevronRight, ChevronLeft, Add,
    DashboardOutlined, AssignmentOutlined, ViewColumnOutlined,
    SettingsOutlined,
    ShowChartOutlined
} from '@material-ui/icons';
import Link from "next/link";

import ProjectContext from '../../context/project/project-context';
import UserContext from '../../context/user/user-context';
import StudentRouter from "../routers/StudentRouter";
import clsx from "clsx";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import Router from 'next/router'
import ProfileMenu from "../profile/ProfileMenu";

const StudentPanelLayout = ({children})=> {
    const classes = useDrawerStyles();
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(()=>{
        projectContext.fetchByStudentId();
        userContext.fetchUserById()
    },[]);
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

    const handleDrawerToggle = ()=>event=>{
        setMobileOpen(!mobileOpen);
    };

    const addMenu = (
        <div>
            <Link href='/student/project/vision-document/new'>
                <MenuItem>
                    <ListItemIcon>
                        <AssignmentOutlined />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Vision Document
                    </Typography>
                </MenuItem>
            </Link>
            <Link href='/student/project/backlog'>
                <MenuItem >
                    <ListItemIcon>
                        <ListAltOutlined />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Backlog
                    </Typography>
                </MenuItem>
            </Link>
        </div>
    );
    const drawer = (
        <Fragment>
            <List>
                <Link href='/student/roadmap'>
                    <ListItem button >
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Roadmap"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/documentation'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Documentation"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/backlog'>
                    <ListItem button >
                        <ListItemIcon>
                            <ListAltOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Backlog"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/scrumBoard'>
                    <ListItem button >
                        <ListItemIcon>
                            <ViewColumnOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Scrum Board"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/progress'>
                    <ListItem button >
                        <ListItemIcon>
                            <ShowChartOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Progress"} />
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List>
                <Link href='/student/project/settings'>
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
     const handleClickProfile = ()=>{
         Router.push('/student/profile');
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
                                        <Avatar  className={classes.avatarSize}>{!userContext.user.isLoading ? userContext.user.user.name.charAt(0).toUpperCase() : 'U' }</Avatar>
                                    </div>
                                    <Divider/>
                                    {drawer}
                                </div>

                            </Drawer>
                        </Hidden>
                    </nav>
                    <div>
                        <StudentRouter>
                            {children}
                        </StudentRouter>
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
                                                <IconButton onClick={handleAddMenuClick} style={{color:'#fff'}} size='small'>
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
                        <StudentRouter>
                            {children}
                        </StudentRouter>
                    </main>
                </Hidden>

            </div>


        </div>
    );

};

export default StudentPanelLayout;
