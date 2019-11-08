import React from 'react';
import {Avatar, Button, Container, Typography} from '@material-ui/core';
import {usePendingStyles} from "../../src/material-styles/pending-page";
import {signout} from "../../auth";

const PendingEligibility = () => {
    const classes = usePendingStyles();
    return (
        <div>
            <Container  component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    <Typography paragraph className={classes.message}>
                        Please Wait while we Check your Eligibility
                    </Typography>
                    <Button variant='contained' color='primary' onClick={()=>signout()}>
                        Sign Out
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default PendingEligibility;