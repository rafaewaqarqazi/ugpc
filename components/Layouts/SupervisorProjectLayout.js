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
    Dashboard,
    VisibilityOutlined,
    Visibility,
    ViewColumnOutlined, ListAlt,
    ShowChart
} from "@material-ui/icons";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import UserContext from '../../context/user/user-context';
import ProjectContext from '../../context/project/project-context';
import MenuIcon from '@material-ui/icons/Menu';
import Router from 'next/router';
import ProfileMenu from "../profile/ProfileMenu";
import {useSwitchStyles} from "../../src/material-styles/selectSwitchStyles";
import MobileDrawer from "./MobileDrawer";
import DrawerLayout from "./DrawerLayout";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
import AddMenu from "./AddMenu";
import DrawerLink from "./DrawerLink";

const SupervisorProjectLayout = ({children,projectId})=> {
    const userContext = useContext(UserContext);
    const projectContext =useContext(ProjectContext);
    const switchClasses = useSwitchStyles();
    useEffect(()=>{
        userContext.fetchUserById();
        projectContext.fetchByProjectId(projectId)
    },[projectId]);
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedProject,setSelectedProject] = useState(projectId);
    const handleSwitchProject = event=>{
        setSelectedProject(event.target.value);
        Router.push(`/supervisor/project/[projectId]/roadmap`,`/supervisor/project/${event.target.value}/roadmap`)
    }
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
                <DrawerLink href='/supervisor/project/[projectId]/roadmap' as={`/supervisor/project/${projectId}/roadmap`}>
                    <ListItemIcon>
                        <Dashboard className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Roadmap"} />
                </DrawerLink>
                <DrawerLink href='/supervisor/project/[projectId]/backlog' as={`/supervisor/project/${projectId}/backlog`}>
                    <ListItemIcon>
                        <ListAlt className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Backlog"} />
                </DrawerLink>
                <DrawerLink href='/supervisor/project/[projectId]/scrumBoard' as={`/supervisor/project/${projectId}/scrumBoard`}>
                    <ListItemIcon>
                        <ViewColumnOutlined className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Scrum Board"} />
                </DrawerLink>
                <DrawerLink href='/supervisor/project/[projectId]/progress' as={`/supervisor/project/${projectId}/progress`}>
                    <ListItemIcon>
                        <ShowChart className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Progress"} />
                </DrawerLink>

            </List>
            <Divider/>
            <List>
                <DrawerLink href='/supervisor/project/[projectId]/meetings' as={`/supervisor/project/${projectId}/meetings`}>
                    <ListItemIcon>
                        <Visibility className={classes.iconColor}/>
                    </ListItemIcon>
                    <ListItemText primary={"Meetings"} />
                </DrawerLink>
            </List>
        </Fragment>

    );
    const handleClickAddMeeting = ()=>{
        Router.push(`/supervisor/project/[projectId]/meetings`,`/supervisor/project/${projectId}/meetings`)
    };
    const addMenu = (
        <MenuItem onClick={handleClickAddMeeting}>
            <ListItemIcon>
                <VisibilityOutlined />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                Meeting
            </Typography>
        </MenuItem>
    );
    const handleClickProfile = ()=>{
        Router.push('/supervisor/profile')
    };

    const accountSwitch = (
        userContext.user.isLoading ? <div style={{flexGrow:1}}/> : userContext.user.user.additionalRole ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch" className={classes.iconColor}>
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    value={'Select'}
                    className={classes.iconColor}
                    input={<OutlinedInput  labelWidth={67} classes={switchClasses} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value='Select' style={{fontSize:14}}>Select View</MenuItem>
                    <MenuItem value={userContext.user.user.role} style={{fontSize:14}}>
                        <Link href='/supervisor/projects'>
                            <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                        </Link>
                    </MenuItem>
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
            <div style={{flexGrow:1}}/>
    );

    const projectSwitch = (
            <div className={classes.toolbar}>
                <FormControl variant="outlined" margin='dense' style={{flexGrow:1}}>
                    <InputLabel htmlFor="projectSwitch" className={classes.iconColor}>
                        Select Project
                    </InputLabel>
                    <Select
                        style={{fontSize:12}}
                        value={selectedProject}
                        className={classes.iconColor}
                        onChange={handleSwitchProject}
                        input={<OutlinedInput classes={switchClasses}  labelWidth={100} fullWidth name="projectSwitch" id="projectSwitch" required/>}
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
                                    <Avatar alt="IIUI-LOGO" src="/static/avatar/avatar/iiui-logo.jpg" />
                                </Tooltip>
                            </div>
                            <AddMenu addMenuContent={addMenu}/>
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
                                projectSwitch={projectSwitch}
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
                    <AppBarWithAddMenu open={open} addMenuContent={addMenu} handleClickProfile={handleClickProfile}/>
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
                            projectSwitch={projectSwitch}
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
export default SupervisorProjectLayout;