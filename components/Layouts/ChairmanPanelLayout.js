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
  Hidden,
  AppBar,
  Toolbar,
  Avatar,
  Typography, Select
} from '@material-ui/core';
import {
  Group,
  SupervisorAccountOutlined,
  SupervisorAccount,
  Settings,
  Dashboard
} from "@material-ui/icons";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import NewUserComponent from "../chairman/add/NewUserComponent";
import MenuIcon from "@material-ui/icons/Menu";
import UserContext from "../../context/user/user-context";
import ProfileMenu from "../profile/ProfileMenu";
import Router from 'next/router';
import DrawerLayout from "./DrawerLayout";
import AppBarWithAddMenu from "./AppBarWithAddMenu";
import MobileDrawer from "./MobileDrawer";
import AddMenu from "./AddMenu";
import DrawerLink from "./DrawerLink";

const ChairmanPanelLayout = ({children}) => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.fetchUserById();
  }, []);
  const classes = useDrawerStyles();
  const [open, setOpen] = useState(true);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerToggle = () => event => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClickProfile = () => {
    Router.push('/chairman/profile');
  };
  const drawerContent = (
    <Fragment>
      <List>
        <DrawerLink href={'/chairman/dashboard'}>
          <ListItemIcon>
            <Dashboard className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Dashboard"}/>
        </DrawerLink>
        <DrawerLink href={'/chairman/users'}>
          <ListItemIcon>
            <SupervisorAccount className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Users"}/>
        </DrawerLink>
        <DrawerLink href={'/chairman/committees'}>
          <ListItemIcon>
            <Group className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Committees"}/>
        </DrawerLink>
      </List>
      <Divider/>
      <List>
        <DrawerLink href={'/chairman/settings'}>
          <ListItemIcon>
            <Settings className={classes.iconColor}/>
          </ListItemIcon>
          <ListItemText primary={"Settings"}/>
        </DrawerLink>
      </List>
    </Fragment>

  );
  const addMenuContent = (
    <MenuItem onClick={() => setOpenAddUser(true)}>
      <ListItemIcon>
        <SupervisorAccountOutlined/>
      </ListItemIcon>
      <Typography variant="inherit" noWrap>
        User
      </Typography>
    </MenuItem>
  );
  return (
    <div>
      <CssBaseline/>
      <div style={{flexGrow: 1}}>
        <Hidden smUp>
          <AppBar position="static" color="default">
            <Toolbar>
              <Hidden smUp>
                <IconButton edge="start" aria-label="menu" onClick={handleDrawerToggle()}>
                  <MenuIcon style={{color: 'grey'}}/>
                </IconButton>
              </Hidden>
              <div style={{flexGrow: 1}}>
                <Tooltip title='UGPC-Software' placement='right'>
                  <Avatar alt="IIUI-LOGO" src="/static/avatar/iiui-logo.jpg"/>
                </Tooltip>
              </div>
              <AddMenu addMenuContent={addMenuContent}/>
              <ProfileMenu handleClickProfile={handleClickProfile}/>
            </Toolbar>
          </AppBar>
          <nav aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp>
              <MobileDrawer
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                drawerContent={drawerContent}
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
            {children}
          </main>
        </Hidden>
      </div>
      {
        openAddUser &&
        <NewUserComponent open={openAddUser} onClose={() => setOpenAddUser(false)}/>
      }
    </div>
  );
};
export default ChairmanPanelLayout;