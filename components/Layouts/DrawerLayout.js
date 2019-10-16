import React from 'react';
import {serverUrl} from "../../utils/config";
import {Divider, IconButton, Tooltip} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";

const DrawerLayout = ({open,handleDrawerOpen,handleDrawerClose,accountSwitch,projectSwitch,drawerContent}) => {
    const classes = useDrawerStyles();
    return (
        <div className={classes.sideBarImage} style={{backgroundImage:`url("${serverUrl}/../static/images/sidebar.jpg")`}}>
            <div className={classes.list}>
                {
                    !open &&
                    <div className={classes.toolbar}>
                        <Tooltip title='Expand' placement='right'>
                            <IconButton onClick={handleDrawerOpen} >
                                <ChevronRight className={classes.iconColor}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                }

                {
                    open &&
                    <div className={classes.toolbar}>
                        {accountSwitch ? accountSwitch : <div style={{flexGrow:1}}/> }
                        <Tooltip title='Collapse' placement='right'>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeft className={classes.iconColor}/>
                            </IconButton>
                        </Tooltip>
                    </div>

                }
                {
                    projectSwitch &&
                    <Divider />
                }

                {open && projectSwitch && projectSwitch}
                <Divider/>
                {drawerContent}
            </div>
        </div>
    );
};

export default DrawerLayout;