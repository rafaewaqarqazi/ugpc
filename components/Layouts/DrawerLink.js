import React from 'react';
import {ListItem} from "@material-ui/core";
import Link from "next/link";
import {useRouter} from "next/router";
import {useDrawerStyles} from "../../src/material-styles/drawerStyles";

const DrawerLink = ({href, as, children}) => {
  const classes = useDrawerStyles();
  const router = useRouter();
  return (
    <Link href={href} as={as ? as : href}>
      <ListItem button className={router.pathname === href ? classes.drawerListItemActive : classes.drawerListItem}>
        {children}
      </ListItem>
    </Link>
  );
};

export default DrawerLink;