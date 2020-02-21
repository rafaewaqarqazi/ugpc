import React, {useContext, useEffect} from 'react';

import {
  CssBaseline,
  Tooltip,
  MenuItem,
  Avatar,
  AppBar,
  Toolbar,
  Button,
  IconButton, FormControl, InputLabel, Select, OutlinedInput
} from '@material-ui/core';

import Link from "next/link";
import {
  HomeOutlined
} from "@material-ui/icons";
import UserContext from '../../context/user/user-context';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";


const EvaluationChairmanLayout = ({children}) => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.fetchUserById();
  }, []);
  const handleClickProfile = () => {
    Router.push('/committee/evaluation/chairman/profile');
  };
  const accountSwitch = (
    userContext.user.isLoading ? <div/> : userContext.user.user.role === 'Supervisor' ?
      <FormControl variant="outlined" margin='dense'>
        <InputLabel htmlFor="accountSwitch">
          Switch to
        </InputLabel>
        <Select
          style={{fontSize: 12}}
          value={userContext.user.user.ugpc_details.position}
          autoWidth
          input={<OutlinedInput labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
        >
          <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize: 14}}>Evaluation Committee
            View</MenuItem>
          <MenuItem value='Supervisor View' style={{fontSize: 14}}>
            <Link href='/supervisor/projects'>
              <a style={{textDecoration: 'none', color: 'inherit'}}>Supervisor View</a>
            </Link>
          </MenuItem>
        </Select>
      </FormControl>
      :
      <div/>
  );
  return (
    <div>
      <CssBaseline/>
      <div style={{flexGrow: 1}}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Link href='/committee/evaluation/chairman'>
              <IconButton size='small' style={{marginRight: 10}}>
                <HomeOutlined style={{width: 32, height: 32}}/>
              </IconButton>
            </Link>
            <Tooltip title='UGPC-Software' placement='right'>
              <div style={{marginRight: 10}}>
                <Link href='/committee/evaluation/chairman'>
                  <Avatar alt="IIUI-LOGO" src="/static/avatar/iiui-logo.jpg" style={{cursor: 'pointer'}}/>
                </Link>
              </div>
            </Tooltip>
            <div style={{marginRight: 10}}>
              {accountSwitch}
            </div>
            <div style={{flexGrow: 1}}>
              <Link href='/committee/evaluation/chairman/projects'>
                <Button color='primary'>
                  My Projects
                </Button>
              </Link>
            </div>

            <ProfileMenu handleClickProfile={handleClickProfile}/>
          </Toolbar>
        </AppBar>
        <div>
          {children}
        </div>
      </div>

    </div>
  );
};
export default EvaluationChairmanLayout;