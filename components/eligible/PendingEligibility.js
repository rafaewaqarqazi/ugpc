import React,{useState} from 'react';
import {Avatar, Button, Container, LinearProgress, Typography} from '@material-ui/core';
import {usePendingStyles} from "../../src/material-styles/pending-page";
import {signout} from "../../auth";
import router from "next/dist/client/router";

const PendingEligibility = () => {
    const classes = usePendingStyles();
    const [loading, setLoading] = useState(false);
    const handleClick=()=>{
        setLoading(true);
        signout()
            .then(res => {
                setLoading(false);
                router.push('/')
            })
    };
    return (
        <div>
            {loading && <LinearProgress color='secondary'/>}
            <Container  component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Avatar alt="IIUI-LOGO" src="/static/images/avatar/iiui-logo.jpg" className={classes.avatar}/>
                    <Typography paragraph className={classes.message}>
                        Please Wait while we Check your Eligibility
                    </Typography>
                    <Button variant='contained' color='primary' onClick={handleClick}>
                        Sign Out
                    </Button>
                </div>
            </Container>
        </div>

    );
};

export default PendingEligibility;