import React, {useContext, useEffect} from 'react';
import {
    Container, Divider,
    FormControl, InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography
} from "@material-ui/core";
import VisionDocsContext from '../../context/visionDocs/visionDocs-context';
import ListVisionDocs from "./higherAuthority/list/ListVisionDocs";
import {makeStyles} from "@material-ui/styles";
import {Assignment, Search} from "@material-ui/icons";
import VisionDocListItem from "./higherAuthority/list/VisionDocListItem";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";


const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(4),
    }
}))
const SupervisorVisionDocs = () => {
    const visionDocsContext = useContext(VisionDocsContext);
    const classes1 = useStyles();
    const classes = useListContainerStyles();
    useEffect(()=>{
        visionDocsContext.fetchBySupervisor();
    },[]);
    return (
        <div >
            {visionDocsContext.visionDocs.isLoading ? <LinearProgress /> :(
                <Container className={classes1.container}>
                    <div className={classes.listContainer}>
                        <div className={classes.top}>
                            <div className={classes.topIconBox} >
                                <Assignment className={classes.headerIcon}/>
                            </div>
                            <div className={classes.topTitle} >
                                <Typography variant='h5'>Vision Documents</Typography>
                            </div>

                        </div>
                        <VisionDocListItem
                            filter={visionDocsContext.visionDocs.visionDocs}
                        />
                    </div>
                </Container>
            )
            }

        </div>
    );
};

export default SupervisorVisionDocs;