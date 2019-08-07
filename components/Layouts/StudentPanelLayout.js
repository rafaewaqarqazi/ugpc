import React, {useState, useContext, useEffect} from 'react';
import ProjectContext from '../../context/project/project-context';
import {
    AppBar, CssBaseline, Divider, Drawer,
    Hidden, IconButton, List, ListItemText,
    ListItem, ListItemIcon, Toolbar, Typography,
    makeStyles, Avatar
} from '@material-ui/core';
import {MoveToInbox,Menu,Input} from '@material-ui/icons';
import Link from "next/link";
import router from 'next/router';
import {isAuthenticated, signout} from "../../auth";
import SuccessSnackBar from "../snakbars/SuccessSnackBar";
import StudentRouter from "../routers/StudentRouter";
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



    const context = useContext(ProjectContext);
    const classes = useStyles();
    useEffect(()=>{
       context.fetchByStudentId(isAuthenticated().user._id);
       if (context.project.project.length === 0){
           console.log('No Project')
       }
    },[]);
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
            <div className={classes.toolbar}/>
            <div className={classes.avatarMargin}>
                <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
            </div>

            <Divider />
            <List>
                <Link href='/student/overview'>
                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"Overview"} />
                    </ListItem>
                </Link>
                <Link href='/student/vision-document'>
                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"Vision Document"} />
                    </ListItem>
                </Link>
                <Link href='/student/project/backlogs'>
                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"Backlogs"} />
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
                <StudentRouter>
                    {children}
                </StudentRouter>
            </main>
        </div>
    );

};

export default StudentPanelLayout;
