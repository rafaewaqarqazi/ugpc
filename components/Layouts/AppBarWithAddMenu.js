import React from 'react';
import {AppBar, Toolbar} from "@material-ui/core";
import ProfileMenu from "../profile/ProfileMenu";
import clsx from "clsx";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";
import AddMenu from "./AddMenu";

const AppBarWithAddMenu = ({open, addMenuContent, handleClickProfile}) => {

  const classes = useDrawerStyles();
  return (
    <AppBar
      position="fixed"
      color='inherit'
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <div className={classes.appBarContent}>
          {
            addMenuContent &&
            <AddMenu addMenuContent={addMenuContent}/>
          }

          <div className={classes.profile}>
            <ProfileMenu handleClickProfile={handleClickProfile}/>
          </div>

        </div>


      </Toolbar>
    </AppBar>
  );
};

export default AppBarWithAddMenu;