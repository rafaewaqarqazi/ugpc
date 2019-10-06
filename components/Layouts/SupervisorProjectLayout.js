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
    VisibilityOutlined,
    ChevronLeft,
    ChevronRight,
    Add,
    PermIdentity,
    ExitToAppOutlined, ViewColumnOutlined, ListAltOutlined,
    BarChartOutlined
} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import ProjectContext from '../../context/project/project-context';
import MenuIcon from '@material-ui/icons/Menu';
import router from "next/dist/client/router";

const SupervisorProjectLayout = ({children,projectId})=> {
    const userContext = useContext(UserContext);
    const projectContext =useContext(ProjectContext);
    useEffect(()=>{
        userContext.fetchUserById();
        projectContext.fetchByProjectId(projectId)
    },[projectId]);
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedProject,setSelectedProject] = useState(projectId);
    const handleSwitchProject = event=>{
        setSelectedProject(event.target.value);
        router.push(`/supervisor/project/[projectId]/roadmap`,`/supervisor/project/${event.target.value}/roadmap`)
    }
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
                <Link href='/supervisor/project/[projectId]/roadmap' as={`/supervisor/project/${projectId}/roadmap`}>
                    <ListItem button >
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Roadmap"} />
                    </ListItem>

                </Link>

                <Link href='/supervisor/project/[projectId]/backlog' as={`/supervisor/project/${projectId}/backlog`}>
                    <ListItem button >
                        <ListItemIcon>
                            <ListAltOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Backlog"} />
                    </ListItem>
                </Link>

                <Link href='/supervisor/project/[projectId]/scrumBoard' as={`/supervisor/project/${projectId}/scrumBoard`}>
                    <ListItem button >
                        <ListItemIcon>
                            <ViewColumnOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Scrum Board"} />
                    </ListItem>
                </Link>

                <Link href='/supervisor/project/[projectId]/progress' as={`/supervisor/project/${projectId}/progress`}>
                    <ListItem button >
                        <ListItemIcon>
                            <BarChartOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Progress"} />
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List>
                <Link href='/supervisor/project/[projectId]/meetings' as={`/supervisor/project/${projectId}/meetings`}>
                    <ListItem button >
                        <ListItemIcon>
                            <Laptop />
                        </ListItemIcon>
                        <ListItemText primary={"Meetings"} />
                    </ListItem>
                </Link>
            </List>
        </Fragment>

    );
    const addMenu = (
        <Link href='/supervisor/meetings'>
            <MenuItem>
                <ListItemIcon>
                    <VisibilityOutlined />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Meeting
                </Typography>
            </MenuItem>
        </Link>
    );
    const profileMenu = (
        <div>
            <Link href='/supervisor/profile'>
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
        userContext.user.isLoading ? <div style={{flexGrow:1}}/> : userContext.user.user.additionalRole ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch">
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    value={'Select'}
                    input={<OutlinedInput  labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value='Select' style={{fontSize:14}}>Select View</MenuItem>
                    <MenuItem value={userContext.user.user.role} style={{fontSize:14}}>
                        <Link href='/supervisor/dashboard'>
                            <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                        </Link>
                    </MenuItem>
                    {
                        userContext.user.user.additionalRole && userContext.user.user.ugpc_details.position === 'Coordinator' &&
                        <MenuItem value='Coordinator View'  style={{fontSize:14}}>
                            <Link href='/committee/defence/coordinator/overview'>
                                <a style={{textDecoration:'none',color:'inherit'}}>Coordinator View</a>
                            </Link>
                        </MenuItem>
                    }
                </Select>
            </FormControl>
            :
            <div style={{flexGrow:1}}/>
    );

    const projectSwitch = (
            <div className={classes.toolbar}>
                <FormControl variant="outlined" margin='dense' style={{flexGrow:1}}>
                    <InputLabel htmlFor="projectSwitch">
                        Select Project
                    </InputLabel>
                    <Select
                        style={{fontSize:12}}
                        value={selectedProject}
                        onChange={handleSwitchProject}
                        input={<OutlinedInput  labelWidth={100} fullWidth name="projectSwitch" id="projectSwitch" required/>}
                    >

                        {
                            !userContext.user.isLoading && userContext.user.user.supervisor_details.projects.map((project) =>

                                <MenuItem key={project._id} value={project.project._id} style={{fontSize:14}} >
                                    {project.title}
                                </MenuItem>

                            )

                        }
                    </Select>
                </FormControl>
            </div>
    )
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
                            {
                                selectedProject !== 'Select' &&
                                <Fragment>
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
                                </Fragment>
                            }

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
                                    {projectSwitch}
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
                                        {
                                            selectedProject !== 'Select' &&
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
                                        }

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
                                    {projectSwitch}
                                <Divider/>
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
export default SupervisorProjectLayout;