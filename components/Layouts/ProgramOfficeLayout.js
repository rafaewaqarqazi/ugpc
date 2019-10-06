import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CssBaseline,
    ListItemIcon,
    Avatar,
    Menu,
    MenuItem,
    Badge
} from '@material-ui/core';
import { Notifications, AccountCircle, ExitToAppOutlined, PermIdentity} from '@material-ui/icons';
import Link from "next/link";
import { signout} from "../../auth";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    list: {
        width: 250,
    },
    button:{
        margin:theme.spacing(1)
    },
    content:{
        marginTop:theme.spacing(3)
    },
    link:{
        textDecoration:'none'
    },
    avatar: {
        margin: 10,
    },
    avatarDrawer: {
        width: 100,
        height: 100,
        margin:'auto'
    },
    avatarMargin:{
        margin: theme.spacing(2)
    }
}));

const ProgramOfficeLayout =  props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen =event => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose=()=> {
        setAnchorEl(null);
    };
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link href='/program-office/profile'>
                <MenuItem onClick={handleMenuClose}>
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
    );


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
                            <a className={classes.link}>
                                UGPC Software
                            </a>
                        </Typography>
                        <div>
                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <Notifications />
                                </Badge>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMenu}
                <div>
                    {props.children}
                </div>

            </div>
        </div>
    );

};

export default ProgramOfficeLayout;