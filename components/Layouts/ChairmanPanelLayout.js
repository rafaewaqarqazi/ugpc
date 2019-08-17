import React,{useState} from 'react';
import clsx from 'clsx';

import {
    Drawer,
    List,
    CssBaseline,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    ListItemIcon, Tooltip
} from '@material-ui/core';
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";
import {Input, MoveToInbox, ChevronLeft, ChevronRight} from "@material-ui/icons";
import {signout} from "../../auth";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";

const ChairmanPanelLayout = ({children})=> {
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = ()=> {
        setOpen(true);
    };

    const handleDrawerClose =()=> {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
            <div className={classes.side}>
                <div className={classes.sidebar}>
                        <div className={classes.menuRightButton} >
                            {
                                !open ?
                                    <Tooltip title='Expand' placement='right'>
                                        <IconButton onClick={handleDrawerOpen} style={{color:'#fff'}}>
                                            <ChevronRight color='inherit'/>
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <div className={classes.blank}/>

                            }
                        </div>
                        <div className={classes.menuRightTopContent}>
                            <Tooltip title='UGPC-Software' placement='right'>
                                <IconButton>
                                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" />
                                </IconButton>
                            </Tooltip>
                        </div>
                </div>
                <div className={classes.list}>
                    <div className={classes.toolbar}>
                        {
                            open &&
                            <Tooltip title='Collapse' placement='right'>
                                <IconButton onClick={handleDrawerClose}>
                                    <ChevronLeft />
                                </IconButton>
                            </Tooltip>
                        }
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
                        <Link href='/chairman/students/all'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"Students"} />
                            </ListItem>
                        </Link>
                        <Link href='/chairman/projects/all'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"Projects"} />
                            </ListItem>
                        </Link>
                        <Link href='/chairman/committee'>
                            <ListItem button >
                                <ListItemIcon>
                                    <MoveToInbox />
                                </ListItemIcon>
                                <ListItemText primary={"Committees"} />
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
            </div>
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
};
export default ChairmanPanelLayout;