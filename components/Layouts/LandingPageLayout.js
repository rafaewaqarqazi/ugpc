import {Fragment, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    CssBaseline,
    Hidden,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar
} from '@material-ui/core';
import {Input} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import Link from "next/link";
import Container from "@material-ui/core/Container";


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

 const LandingPageLayout =  props => {

    const classes = useStyles();
    const [open,setOpen] = useState(false);

    const drawer = (
        <div className={classes.list}>
            <div className={classes.avatarMargin}>
                <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatarDrawer}/>
            </div>
            <Divider />
            <List>
                <Link href='/sign-in'>
                    <ListItem button >
                        <ListItemIcon >
                            <Input />
                        </ListItemIcon>
                        <ListItemText primary={'Login'} />
                    </ListItem>
                </Link>
            </List>
        </div>
    );
    const handleDrawerToggle = ()=>event=>{
        setOpen(!open);
    };

    return (
        <div>
            <CssBaseline/>
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu" onClick={handleDrawerToggle()}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Link href='/'>
                            <Avatar alt="IIUI-LOGO"
                                    src="/static/images/avatar/iiui-logo.jpg"
                                    className={classes.avatar}
                            />
                        </Link>
                        <Typography variant='h5' color='primary' className={classes.title}>
                            <Link href='/'>
                                <a className={classes.link}>
                                    UGPC Software
                                </a>
                            </Link>
                        </Typography>

                        <Hidden xsDown >
                            <Link href='/sign-in'>
                                <Button color="primary" variant='outlined' className={classes.button}>Login</Button>
                            </Link>
                            <Link href='/student/sign-up'>
                                <Button color="primary" variant='outlined' className={classes.button}>Sign Up</Button>
                            </Link>
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <nav  aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp >
                        <Drawer
                            variant="temporary"
                            open={open}
                            onClose={handleDrawerToggle()}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <div>
                    {props.children}
                </div>

            </div>
        </div>
    );

};

export default LandingPageLayout;