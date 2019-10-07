import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Avatar,
} from '@material-ui/core';
import Router from "next/router";
import ProfileMenu from "../profile/ProfileMenu";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1
    },
    avatar: {
        margin: 10,
    },

}));

const ProgramOfficeLayout =  props => {
    const classes = useStyles();
    const handleClickProfile = ()=>{
        Router.push('/chairmanOffice/profile');
    };
    return (
        <div>
            <CssBaseline/>
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Avatar alt="IIUI-LOGO"
                                src="/static/images/avatar/iiui-logo.jpg"
                                className={classes.avatar}
                        />
                        <Typography variant='h5' color='primary' className={classes.title}>
                            UGPC Software
                        </Typography>
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

export default ProgramOfficeLayout;