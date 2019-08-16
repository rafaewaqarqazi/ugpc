import React, {useState, useContext, useEffect} from 'react';
import clsx from 'clsx';
import {
    AppBar, CssBaseline, Divider, Drawer,
    Hidden, IconButton, List, ListItemText,
    ListItem, ListItemIcon, Toolbar, Typography,
    makeStyles, Avatar, Grid,useTheme
} from '@material-ui/core';
import {MoveToInbox,Menu,Input} from '@material-ui/icons';
import Link from "next/link";
import {isAuthenticated, signout} from "../../auth";
import ProjectContext from '../../context/project/project-context';
import UserContext from '../../context/user/user-context';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
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
    const theme = useTheme();
    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(true);


    useEffect(()=>{
        projectContext.fetchByStudentId();
        userContext.fetchByUserId(isAuthenticated().user._id)
    },[])

    const handleDrawerToggle =()=> {
        setMobileOpen(!mobileOpen);
    };
    const handleDrawerOpen = ()=> {
        setOpen(true);
    }
   const handleDrawerClose = ()=> {
        setOpen(false);
    }
    const drawer = (
        <div>
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
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Persistent drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                {drawer}
            </Drawer>


            <main className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}>
                <div className={classes.drawerHeader} />
                {children}
            </main>
        </div>

    );

};

export default ChairmanPanelLayout;
