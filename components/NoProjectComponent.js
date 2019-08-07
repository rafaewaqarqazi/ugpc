import React from 'react';
import {Avatar, Button, Container, Typography} from '@material-ui/core'
import {usePendingStyles} from "../src/material-styles/pending-page";
import router from "next/router";

const NoProjectComponent = () => {
    const classes = usePendingStyles();
    const handleClick = ()=>{
        router.push('/student/project/create');
    };
    return (
        <div>
            <Container  component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    <Typography paragraph className={classes.message}>
                        You Don't have any Projects Yet!
                    </Typography>
                    <Button variant='outlined' color='secondary' onClick={handleClick}>
                        Create Project
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default NoProjectComponent;