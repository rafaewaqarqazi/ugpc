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
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
} from '@material-ui/core';

import Link from "next/link";
import {
    DashboardOutlined,
    Laptop,
    ChevronLeft,
    ChevronRight,
    PermIdentity,
    ExitToAppOutlined, AssignmentOutlined,
    BallotOutlined
} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import MenuIcon from '@material-ui/icons/Menu';

const SupervisorLayout = ({children})=> {
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
                <Link href='/supervisor/visionDocuments'>
                    <ListItem button >
                        <ListItemIcon>
                            <AssignmentOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Vision Documents"}  style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>

                <Link href='/supervisor/finalDocumentations'>
                    <ListItem button >
                        <ListItemIcon>
                            <BallotOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Final Documentation"}  style={{whiteSpace:'normal'}} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
    const profileMenu = (
        <div>
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
        </div>
    );
    const accountSwitch = (
        userContext.user.isLoading ? <div /> : userContext.user.user.additionalRole ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch">
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    value={userContext.user.user.role}
                    input={<OutlinedInput  labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value={userContext.user.user.role} style={{fontSize:14}}>Supervisor View</MenuItem>
                    {
                        userContext.user.user.additionalRole && userContext.user.user.ugpc_details.position === 'Coordinator' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/coordinator/overview'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Coordinator View</a>
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

                            <Tooltip title='Your Profile & Settings' placement='right'>
                                <Avatar  onClick={handleProfileMenuClick} className={classes.avatarColor}>
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
                                onClose={handleProfileMenuClose}
                            >
                                {profileMenu}
                            </Menu>
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
                                    <div className={classes.avatarDrawer}>
                                        {accountSwitch}
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
                                        <Tooltip title='UGPC-Software' placement='right'>
                                            <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatarMargin}/>
                                        </Tooltip>
                                    </div>

                                    <div className={classes.menuRightTopContent}>
                                        <Tooltip title='Your Profile & Settings' placement='right'>
                                            <Avatar  onClick={handleProfileMenuClick} className={classes.avatarColor}>
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
                                            onClose={handleProfileMenuClose}
                                        >
                                            {profileMenu}

                                        </Menu>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.list}>
                                <div className={classes.toolbar}>
                                    {accountSwitch}
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
export default SupervisorLayout;