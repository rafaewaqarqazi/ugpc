import React, {useState, useContext, useEffect} from 'react';

import {
    CssBaseline, Divider, Drawer,
    IconButton, List, ListItemText,
    ListItem, ListItemIcon,
    Avatar, Tooltip, Menu,
    MenuItem
} from '@material-ui/core';
import {MoveToInbox, Input, ChevronRight, ChevronLeft, Add} from '@material-ui/icons';
import Link from "next/link";
import {isAuthenticated, signout} from "../../auth";
import ProjectContext from '../../context/project/project-context';
import UserContext from '../../context/user/user-context';
import StudentRouter from "../routers/StudentRouter";
import clsx from "clsx";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";


const StudentPanelLayout = ({children})=> {
    const classes = useDrawerStyles();
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    useEffect(()=>{
        projectContext.fetchByStudentId();
        userContext.fetchByUserId(isAuthenticated().user._id)
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


    const handleProfileMenuClose = ()=>{
        setAnchorEl2(null);
    };
    const handleProfileMenuClick = event =>{
        setAnchorEl2(event.currentTarget)
    };
    return (
        <div className={classes.root}>
            <CssBaseline />
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
                                            <Link href='/student/project/vision-document/new'>
                                                <MenuItem>Vision Document</MenuItem>
                                            </Link>
                                            <Link href='/student/project/backlogs/add'>
                                                <MenuItem >Backlogs</MenuItem>
                                            </Link>
                                        </Menu>
                                    </div>
                                </div>

                                <div className={classes.menuRightTopContent}>
                                    <Tooltip title='Your Profile & Settings' placement='right'>
                                        <IconButton onClick={handleProfileMenuClick}>
                                            <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" style={{width:30,height:30}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl2}
                                        keepMounted
                                        open={Boolean(anchorEl2)}
                                        onClose={handleProfileMenuClose}
                                    >
                                        <Link href='/student/profile'>
                                            <MenuItem>Profile</MenuItem>
                                        </Link>
                                        <MenuItem onClick={()=>signout()}>Sign Out</MenuItem>

                                    </Menu>
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

                        <List>
                            <Link href='/student/overview'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <MoveToInbox />
                                    </ListItemIcon>
                                    <ListItemText primary={"Roadmap"} />
                                </ListItem>
                            </Link>
                            <Link href='/student/project/vision-document'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <MoveToInbox />
                                    </ListItemIcon>
                                    <ListItemText primary={"Vision Docs"} />
                                </ListItem>
                            </Link>
                            <Link href='/student/project/backlogs'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <MoveToInbox />
                                    </ListItemIcon>
                                    <ListItemText primary={"Backlogs"} />
                                </ListItem>
                            </Link>
                        </List>

                    </div>
                </div>
            </Drawer>
            <main className={classes.content}>
                <StudentRouter>
                    {children}
                </StudentRouter>
            </main>
        </div>
    );

};

export default StudentPanelLayout;
