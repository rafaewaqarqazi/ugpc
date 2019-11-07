import React, {useContext, useEffect} from 'react';

import {
    CssBaseline,
    Tooltip,
    MenuItem,
    Avatar,
    AppBar,
    Toolbar,
    FormControl,
    InputLabel,
    OutlinedInput,
    Select
} from '@material-ui/core';

import Link from "next/link";
import UserContext from '../../context/user/user-context';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";


const CommitteeMemberLayout = ({children,committeeType,position})=> {

    const userContext = useContext(UserContext);
    useEffect(()=>{
        userContext.fetchUserById();
    },[]);
    const handleClickProfile = ()=>{
        if (committeeType === 'Defence' && position === 'Member'){
            Router.push('/committee/defence/member/profile');
        }else if (committeeType === 'Defence' && position === 'Chairman_Committee'){
            Router.push('/committee/defence/chairman/profile');
        }
        else if (committeeType === 'Evaluation'){
            Router.push('/committee/evaluation/member/profile');
        }
    };
    const accountSwitch = (
        userContext.user.isLoading ? <div /> : userContext.user.user.role === 'Supervisor' ?
            <FormControl variant="outlined" margin='dense' >
                <InputLabel htmlFor="accountSwitch">
                    Switch to
                </InputLabel>
                <Select
                    style={{fontSize:12}}
                    value={userContext.user.user.ugpc_details.position}
                    autoWidth
                    input={<OutlinedInput  labelWidth={67} fullWidth name="accountSwitch" id="accountSwitch" required/>}
                >
                    <MenuItem value={userContext.user.user.ugpc_details.position} style={{fontSize:14}}>Evaluation Committee View</MenuItem>
                    <MenuItem value='Supervisor View' style={{fontSize:14}}>
                        <Link href='/supervisor/dashboard'>
                            <a style={{textDecoration:'none',color:'inherit'}}>Supervisor View</a>
                        </Link>
                    </MenuItem>
                </Select>
            </FormControl>
            :
            <div/>
    );
    return (
        <div >
            <CssBaseline />
            <div style={{flexGrow:1}}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <div style={{marginRight:10}}>
                            <Tooltip title='UGPC-Software' placement='right'>
                                <Avatar alt="IIUI-LOGO" src="/static/avatar/avatar/iiui-logo.jpg" style={{cursor:'pointer'}}/>
                            </Tooltip>
                        </div>
                        <div style={{flexGrow:1}}>
                            {accountSwitch}
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
export default CommitteeMemberLayout;