import React, {useState, useContext, useEffect, Fragment} from 'react';

import {
  CssBaseline, Divider, Drawer,
  IconButton, List, ListItemText,
  ListItemIcon,
  Avatar, Tooltip,
  MenuItem,
  Hidden, Toolbar, AppBar
} from '@material-ui/core';
import {
  ListAltOutlined, ListAlt,
  Dashboard, Assignment, AssignmentOutlined, ViewColumn,
  ShowChart,
  Visibility
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
import AddMenu from "./AddMenu";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
import DrawerLayout from "./DrawerLayout";
import MobileDrawer from "./MobileDrawer";
import DrawerLink from "./DrawerLink";

const StudentPanelLayout = ({children}) => {
  const classes = useDrawerStyles();
  const projectContext = useContext(ProjectContext);
  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    projectContext.fetchByStudentId();
    userContext.fetchUserById()
  }, []);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => event => {
    setMobileOpen(!mobileOpen);
  };

  const addMenuContent = (
    <div>
      {
        !projectContext.project.isLoading && projectContext.project.project && projectContext.project.project.documentation.visionDocument.filter(visionDoc => visionDoc.status === 'Approved' || visionDoc.status === 'Approved With Changes').length === 0 &&
        <Link href='/student/project/vision-document/new'>
          <MenuItem>
            <ListItemIcon>
              <AssignmentOutlined/>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Vision Document
            </Typography>
          </MenuItem>
        </Link>
      }

      <Link href='/student/project/backlog'>
        <MenuItem>
          <ListItemIcon>
            <ListAltOutlined/>
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Backlog
          </Typography>
        </MenuItem>
      </Link>
    </div>
  );
  const drawerContent = (
    <Fragment>
      <List>
        <DrawerLink href={'/student/roadmap'}>
          <ListItemIcon>
            <Dashboard className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Roadmap"}/>
        </DrawerLink>
        <DrawerLink href={'/student/project/documentation'}>
          <ListItemIcon>
            <Assignment className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Documentation"}/>
        </DrawerLink>
        <DrawerLink href={'/student/project/backlog'}>
          <ListItemIcon>
            <ListAlt className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Backlog"}/>
        </DrawerLink>
        <DrawerLink href={'/student/project/scrumBoard'}>
          <ListItemIcon>
            <ViewColumn className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Scrum Board"}/>
        </DrawerLink>
        <DrawerLink href={'/student/project/progress'}>
          <ListItemIcon>
            <ShowChart className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Progress"}/>
        </DrawerLink>
      </List>
      <Divider/>
      <List>
        <DrawerLink href={'/student/project/meetings'}>
          <ListItemIcon>
            <Visibility className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Meetings"}/>
        </DrawerLink>
      </List>
    </Fragment>
  );
  const handleClickProfile = () => {
    Router.push('/student/profile');
  };
  return (
    <div>
      <CssBaseline/>
      <div style={{flexGrow: 1}}>
        <Hidden smUp>
          <AppBar position="static" color="default">
            <Toolbar>
              <Hidden smUp>
                <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu"
                            onClick={handleDrawerToggle()}>
                  <MenuIcon/>
                </IconButton>
              </Hidden>
              <div style={{flexGrow: 1}}>
                <Tooltip title='UGPC-Software' placement='right'>
                  <Avatar alt="IIUI-LOGO" src="/static/avatar/iiui-logo.jpg"/>
                </Tooltip>
              </div>
              <AddMenu addMenuContent={addMenuContent}/>
              <div className={classes.profile}>
                <ProfileMenu handleClickProfile={handleClickProfile}/>
              </div>
            </Toolbar>
          </AppBar>
          <nav>
            <Hidden smUp>
              <MobileDrawer
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                drawerContent={drawerContent}
              />
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
            />
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
