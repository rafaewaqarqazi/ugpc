import React, {useContext, useState} from 'react';
import {SupervisorAccountOutlined} from "@material-ui/icons";
import {Box,Tab, Tabs, Typography} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {useTheme} from "@material-ui/styles";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import UserContext from "../../../context/user/user-context";
import CommitteeTypeComponent from "./CommitteeTypeComponent";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";

const TabPanel = props => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={1}>{children}</Box>
        </div>
    );
};
const a11yProps = index => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};
const CommitteesComponent = () => {
    const userContext = useContext(UserContext);
    const classes = useListContainerStyles();
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [success,setSuccess]=useState({
        show:false,
        message:''
    });
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    const handleSuccess = ()=>{
        setSuccess({show:false,message:''});
        userContext.fetchCommittees()
            .catch(error => console.error(error.message));
    };
    return (
        <div>
            <SuccessSnackBar open={success.show} message={success.message} handleClose={handleSuccess}/>
            <div className={classes.listContainer} style={{backgroundColor:'inherit'}}>
                <div className={classes.top}>
                    <div className={classes.topIconBox} >
                        <SupervisorAccountOutlined className={classes.headerIcon}/>
                    </div>
                    <div className={classes.topTitle} >
                        <Typography variant='h5'>Committees</Typography>
                    </div>
                </div>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                >
                    <Tab label="Defence" {...a11yProps(0)} />
                    <Tab label="Evaluation" {...a11yProps(1)} />
                </Tabs>

                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <CommitteeTypeComponent
                            type='Defence'
                            setSuccess={setSuccess}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <CommitteeTypeComponent
                            type='Evaluation'
                            setSuccess={setSuccess}
                        />

                    </TabPanel>
                </SwipeableViews>
            </div>

        </div>
    );
};

export default CommitteesComponent;