import React, {useState, useContext, useEffect} from 'react';

import {
    AppBar, CssBaseline, Divider, Drawer,
    Hidden, IconButton, List, ListItemText,
    ListItem, ListItemIcon, Toolbar, Typography,
    makeStyles, Avatar, Grid
} from '@material-ui/core';
import {MoveToInbox,Menu,Input} from '@material-ui/icons';
import Link from "next/link";
import {isAuthenticated, signout} from "../../auth";
import ProjectContext from '../../context/project/project-context';
import UserContext from '../../context/user/user-context';

const drawerWidth = 280;

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

        zIndex: theme.zIndex.drawer + 1,

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
    },
    avatar: {
        width: 100,
        height: 100,
        margin:'auto'
    },
    avatarMargin:{
        margin: theme.spacing(2)
    },
    blue:{
        background:theme.palette.primary.dark,
        height: '100%'
    }
}));

const ChairmanPanelLayout = ({children})=> {
    const classes = useStyles();
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [mobileOpen, setMobileOpen] = useState(false);


    useEffect(()=>{
        projectContext.fetchByStudentId();
        userContext.fetchByUserId(isAuthenticated().user._id)
    },[])

    const handleDrawerToggle =()=> {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <div className={classes.toolbar}/>
                    <div className={classes.blue}></div>
                </Grid>
                <Grid item xs={10}>
                    <div className={classes.toolbar}/>
                    <div className={classes.avatarMargin}>
                        <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    </div>

                    <Divider />
                    <List>
                        <Link href='/chairman/overview'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"Overview"} />
                            </ListItem>
                        </Link>
                        <Link href='/chairman/users/create'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"Create New User"} />
                            </ListItem>
                        </Link>
                        <Link href='/chairman/users/all'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"All Users"} />
                            </ListItem>
                        </Link>
                        <ListItem button onClick={()=>signout()}>
                            <ListItemIcon>
                                <Input />
                            </ListItemIcon>
                            <ListItemText primary={"SignOut"} />
                        </ListItem>

                    </List>
                </Grid>

            </Grid>
        </div>
    );

    return (

        <div className={classes.root}>
            <CssBaseline />
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

export default ChairmanPanelLayout;
