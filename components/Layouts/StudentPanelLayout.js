import React, {useState, useContext, useEffect, Fragment} from 'react';

import {
    CssBaseline, Divider, Drawer,
    IconButton, List, ListItemText,
    ListItem, ListItemIcon,
    Avatar, Tooltip, Menu,
    MenuItem,
    Hidden, Toolbar, AppBar
} from '@material-ui/core';
import {ListAltOutlined,ListAlt, ChevronRight, ChevronLeft, Add,
    Dashboard, Assignment,AssignmentOutlined, ViewColumn,
    ShowChart
} from '@material-ui/icons';
import Link from "next/link";

import ProjectContext from '../../context/project/project-context';
import UserContext from '../../context/user/user-context';
import StudentRouter from "../routers/StudentRouter";
import clsx from "clsx";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import Router, {useRouter} from 'next/router'
import ProfileMenu from "../profile/ProfileMenu";
import {serverUrl} from "../../utils/config";

const StudentPanelLayout = ({children})=> {
    const router = useRouter();
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
            {
                !projectContext.project.isLoading && projectContext.project.project.documentation.visionDocument.filter(visionDoc => visionDoc.status === 'Approved' || visionDoc.status === 'Approved With Changes').length === 0 &&
                <Link href='/student/project/vision-document/new'>
                    <MenuItem >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Vision Document
                        </Typography>
                    </MenuItem>
                </Link>
            }

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
                <Link href='/student/roadmap' >
                    <ListItem button className={router.pathname === '/student/roadmap' ? classes.drawerListItemActive : classes.drawerListItem} >
                        <ListItemIcon>
                            <Dashboard className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Roadmap"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/documentation'>
                    <ListItem button className={router.pathname === '/student/project/documentation' ? classes.drawerListItemActive : classes.drawerListItem} >
                        <ListItemIcon>
                            <Assignment className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Documentation"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/backlog'>
                    <ListItem button className={router.pathname === '/student/project/backlog' ? classes.drawerListItemActive : classes.drawerListItem}>
                        <ListItemIcon>
                            <ListAlt className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Backlog"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/scrumBoard'>
                    <ListItem button className={router.pathname === '/student/project/scrumBoard' ? classes.drawerListItemActive : classes.drawerListItem}>
                        <ListItemIcon>
                            <ViewColumn className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Scrum Board"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/progress'>
                    <ListItem button  className={router.pathname === '/student/project/progress' ? classes.drawerListItemActive : classes.drawerListItem}>
                        <ListItemIcon>
                            <ShowChart className={classes.iconColor}/>
                        </ListItemIcon>
                        <ListItemText primary={"Progress"} />
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
                            <div className={classes.profile}>
                                <ProfileMenu handleClickProfile={handleClickProfile}/>
                            </div>
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
                                <div  style={{width:250,height:'100%'}}>
                                    <div className={classes.sideBarImage} style={{backgroundImage:`url("${serverUrl}/../static/images/sidebar.jpg")`}}>
                                        <div className={classes.list}>
                                            <div className={classes.avatarDrawer}>
                                                {
                                                    userContext.user.isLoading ?
                                                        <Avatar  onClick={event =>  setAnchorEl(event.currentTarget)}  className={`${classes.profileAvatarColor} ${classes.avatarSize}`}>
                                                            U
                                                        </Avatar>
                                                        :
                                                        userContext.user.user.profileImage.filename ?
                                                            <Avatar className={classes.avatarSize} onClick={event =>  setAnchorEl(event.currentTarget)}   src={`${serverUrl}/../static/images/${userContext.user.user.profileImage.filename }`}  />
                                                            :
                                                            <Avatar  onClick={event =>  setAnchorEl(event.currentTarget)} className={`${classes.profileAvatarColor} ${classes.avatarSize}`}>
                                                                { userContext.user.user.name.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                }
                                            </div>
                                            <Divider/>
                                            {drawer}
                                        </div>
                                    </div>
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
                    <AppBar
                        position="fixed"
                        color='inherit'
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open,
                        })}
                    >
                        <Toolbar>
                            <div className={classes.appBarContent}>
                                <div>
                                    <Tooltip title='Add' placement='right'>
                                        <IconButton onClick={handleAddMenuClick} size='small'>
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
                                <div className={classes.profile}>
                                    <ProfileMenu handleClickProfile={handleClickProfile}/>
                                </div>

                            </div>


                        </Toolbar>
                    </AppBar>
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
                        <div className={classes.sideBarImage} style={{backgroundImage:`url("${serverUrl}/../static/images/sidebar.jpg")`}}>
                            <div className={classes.list}>
                                {
                                    !open &&
                                    <div className={classes.toolbar}>
                                        <Tooltip title='Expand' placement='right'>
                                            <IconButton onClick={handleDrawerOpen} style={{color:'#fff'}}>
                                                <ChevronRight color='inherit'/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }

                                    {
                                        open &&
                                        <div className={classes.toolbar}>
                                            <div style={{flexGrow:1}}/>
                                        <Tooltip title='Collapse' placement='right'>
                                            <IconButton onClick={handleDrawerClose}>
                                                <ChevronLeft className={classes.iconColor}/>
                                            </IconButton>
                                        </Tooltip>
                                        </div>

                                    }
                                <Divider />
                                {drawer}



                            </div>
                        </div>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
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
