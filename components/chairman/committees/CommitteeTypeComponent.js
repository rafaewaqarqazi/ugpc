import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import {Tabs,Tab,Box} from '@material-ui/core';
import RenderCommitteeDepartmentsComponent from "./RenderCommitteeDepartmentsComponent";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import UserContext from "../../../context/user/user-context";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={1}>{children}</Box>
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        minHeight: 300,
        width:'100%'
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

const CommitteeTypeComponent = ({committeeType,setSuccess}) => {
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [members,setMembers] = useState(committeeType ? committeeType.members : [])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>


            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="standard"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                >
                    <Tab label="BSSE" {...a11yProps(0)} />
                    <Tab label="BSCS" {...a11yProps(1)} />
                    <Tab label="BSIT" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0} style={{flexGrow:1}}>
                    <RenderCommitteeDepartmentsComponent
                        department='BSSE'
                        members={members}
                        committeeType={committeeType._id}
                        setSuccess={setSuccess}
                    />
                </TabPanel>
                <TabPanel value={value} index={1} style={{flexGrow:1}}>
                    <RenderCommitteeDepartmentsComponent
                        department='BSCS'
                        members={members}
                        committeeType={committeeType._id}
                        setSuccess={setSuccess}
                    />
                </TabPanel>
                <TabPanel value={value} index={2} style={{flexGrow:1}}>
                    <RenderCommitteeDepartmentsComponent
                        department='BSIT'
                        members={members}
                        committeeType={committeeType._id}
                        setSuccess={setSuccess}
                    />
                </TabPanel>
            </div>
        </div>

    );
};

export default CommitteeTypeComponent;