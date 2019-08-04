import React,{useState} from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    CssBaseline,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItemText,
    ListItem,
    ListItemIcon,
    Toolbar,
    Typography,
    makeStyles,
    Snackbar,
    SnackbarContent
} from '@material-ui/core';
import {MoveToInbox,Menu,Input,CheckCircle,Close} from '@material-ui/icons';
import Link from "next/link";
import router from 'next/router';
import {signout} from "../../auth";
import { green } from '@material-ui/core/colors';
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
    success: {
        backgroundColor: green[600],
    },
    successMessage: {
        display: 'flex',
        alignItems: 'center',
    },
    iconVariant: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
}));

const StudentPanelLayout = (props)=> {
    const { container } = props;
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
            <div className={classes.toolbar} />

            <Divider />
            <List>
                <Link href='/'>
                    <ListItem button >
                        <ListItemIcon>
                            <MoveToInbox />
                        </ListItemIcon>
                        <ListItemText primary={"HOME"} />
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
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={success}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                onClose={handleSuccess}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classes.success}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.successMessage}>
                            <CheckCircle className={classes.iconVariant}/>
                            {successMessage}
                        </span>
                    }
                    action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={handleSuccess}>
                            <Close />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
            <AppBar position="fixed" className={classes.appBar}>
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
                        container={container}
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
                {props.children}
            </main>
        </div>
    );
}

StudentPanelLayout.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    container: PropTypes.object,
};

export default StudentPanelLayout;
