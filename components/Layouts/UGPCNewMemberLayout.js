import React, {useContext, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Avatar, Tooltip,
} from '@material-ui/core';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";
import UserContext from "../../context/user/user-context";
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  avatar: {
    margin: 10,
    cursor: 'pointer'
  },
}));

const UGPCNewMemberLayout = props => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.fetchUserById();
  }, []);
  const handleClickProfile = () => {
    Router.push('/UGPC_Member/profile');
  };
  return (
    <div>
      <CssBaseline/>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Tooltip title='Home' placement='bottom'>
              <div>
                <Link href='/UGPC_Member/profile'>
                  <Avatar alt="IIUI-LOGO"
                          src="/static/images/avatar/iiui-logo.jpg"
                          className={classes.avatar}
                  />
                </Link>
              </div>
            </Tooltip>
            <Tooltip title='Home' placement='bottom-start'>
              <Typography variant='h6' color='textSecondary' className={classes.title}>
                <Link href='/UGPC_Member/profile'>
                  <a className={classes.link}>
                    UGPC Software
                  </a>
                </Link>
              </Typography>
            </Tooltip>
            <ProfileMenu handleClickProfile={handleClickProfile}/>
          </Toolbar>
        </AppBar>

        <div>
          {props.children}
        </div>

      </div>
    </div>
  );

};

export default UGPCNewMemberLayout;