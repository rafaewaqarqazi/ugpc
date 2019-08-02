import {Fragment, Component} from 'react';
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
    withStyles
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    list: {
        width: 250,
    }
}));

export default function LandingPageLayout (){

    const classes = useStyles();
    const [open,setOpen] = React.useState(false);

    const drawer = (
        <div className={classes.list}>
            <div className={classes.toolbar}/>
            <Divider />
            <List>
                    <ListItem button>
                        <ListItemIcon> <InboxIcon /></ListItemIcon>
                        <ListItemText primary={'Login'} />
                    </ListItem>

            </List>
        </div>
    );
    const handleDrawerToggle = ()=>event=>{
        console.log('Triggered')
        setOpen(!open);
    };

    return (
        <Fragment>
            <CssBaseline/>
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerToggle()}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>

                        <Typography variant="h6" className={classes.title}>
                            News
                        </Typography>
                        <Hidden xsDown >
                            <Button color="inherit" >Login</Button>
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
            </div>
        </Fragment>
    );

}