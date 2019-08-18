import React,{useState} from 'react';
import clsx from 'clsx';

import {
    Drawer,
    List,
    CssBaseline,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    ListItemIcon, Tooltip, Menu, MenuItem
} from '@material-ui/core';
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";
import {DashboardOutlined, Laptop,SupervisorAccountOutlined,VisibilityOutlined, ChevronLeft, ChevronRight, Add, Face, PermIdentity, ExitToAppOutlined} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import Typography from "@material-ui/core/Typography";
import UserState from "../../context/user/UserState";

const ChairmanPanelLayout = ({children})=> {
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
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
                                        <Link href='/chairman/add/user'>
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <SupervisorAccountOutlined />
                                                </ListItemIcon>
                                                <Typography variant="inherit" noWrap>
                                                    User
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                        <Link href='/chairman/add/committee'>
                                            <MenuItem >
                                                <ListItemIcon>
                                                    <VisibilityOutlined />
                                                </ListItemIcon>
                                                <Typography variant="inherit" noWrap>
                                                    Committee
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                    </Menu>
                                </div>
                            </div>

                            <div className={classes.menuRightTopContent}>
                                <Tooltip title='Your Profile & Settings' placement='right'>
                                    <IconButton onClick={handleProfileMenuClick} size='small'>
                                        <Face fontSize='large' color='action'/>
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
                            <Link href='/chairman/overview'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={"Overview"} />
                                </ListItem>
                            </Link>

                            <Link href='/chairman/projects'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <Laptop />
                                    </ListItemIcon>
                                    <ListItemText primary={"Projects"} />
                                </ListItem>
                            </Link>

                            <Link href='/chairman/users'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <SupervisorAccountOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={"Users"} />
                                </ListItem>
                            </Link>

                            <Link href='/chairman/committees'>
                                <ListItem button >
                                    <ListItemIcon>
                                        <VisibilityOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={"Committees"} />
                                </ListItem>
                            </Link>

                        </List>

                    </div>
                </div>
            </Drawer>
            <main className={classes.content}>
                <UserState>
                    {children}
                </UserState>
            </main>
        </div>
    );
};
export default ChairmanPanelLayout;