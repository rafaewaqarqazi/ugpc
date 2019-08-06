import React, { useState} from 'react';

import {
    AppBar, CssBaseline, Divider, Drawer,
    Hidden, IconButton, List, ListItemText,
    ListItem, ListItemIcon, Toolbar, Typography,
    makeStyles, Avatar
} from '@material-ui/core';
import {MoveToInbox,Menu,Input} from '@material-ui/icons';
import Link from "next/link";
import router from 'next/router';
import { signout} from "../../auth";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
const drawerWidth = 230;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    avatar: {
        width: 100,
        height: 100,
        margin:'auto'
    },
    avatarMargin:{
        margin: theme.spacing(2)
    }
}));

const StudentPanelLayout = ({children})=> {


    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [success,setSuccess] = useState(false);
    const [successMessage,setSuccessMessage] = useState('');
    const handleDrawerToggle =()=> {
        setMobileOpen(!mobileOpen);
    };
    const signOut = ()=>{
        signout()
            .then(res =>{
                setSuccess(true);
                setSuccessMessage(res.message);
             })
    };
    const handleSuccess = ()=>{
        setSuccess(false);
        router.push('/');
    };
    const drawer = (
        <div>
            <div className={classes.avatarMargin}>
                <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
            </div>

            <Divider />
            <List>
                <Link href='/student-panel/vision-document'>
                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"Vision Document"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link href='/About'>

                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"About"} />
                    </ListItem>

                </Link>


                <ListItem button onClick={signOut}>
                <ListItemIcon>
                    <Input />
                </ListItemIcon>
                <ListItemText primary={"SignOut"} />
            </ListItem>

            </List>
        </div>
    );

    return (
            <div className={classes.root}>
                <CssBaseline />
              <SuccessSnackBar open={success} message={successMessage} handleClose={handleSuccess}/>
                <AppBar position="fixed" className={classes.appBar} color='secondary'>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Responsive drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer

                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
    );
};

export default StudentPanelLayout;
