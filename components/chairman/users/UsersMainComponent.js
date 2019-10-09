import React, {useContext} from 'react';
import {Box, Tab, Tabs, Typography} from "@material-ui/core";
import { SupervisorAccountOutlined} from "@material-ui/icons";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import SwipeableViews from "react-swipeable-views";
import {useTheme} from "@material-ui/styles";
import RenderStudents from "./RenderStudents";
import RenderSupervisors from "./RenderSupervisors";
import RenderUGPCMembers from "./RenderUGPCMembers";
import RenderOfficeUsers from "./RenderOfficeUsers";
import UserContext from '../../../context/user/user-context';
import CircularLoading from "../../loading/CircularLoading";

const TabPanel = props => {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={2}>{children}</Box>
        </Typography>
    );
};
const a11yProps = index => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
const UsersMainComponent = () => {
    const classes = useListContainerStyles();
    const userContext = useContext(UserContext);
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    return (
        <div>
            <div className={classes.listContainer} style={{backgroundColor:'inherit'}}>
                <div className={classes.top}>
                    <div className={classes.topIconBox} >
                        <SupervisorAccountOutlined className={classes.headerIcon}/>
                    </div>
                    <div className={classes.topTitle} >
                        <Typography variant='h5'>Users</Typography>
                    </div>
                </div>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                >
                    <Tab label="Students" {...a11yProps(0)} />
                    <Tab label="Supervisors" {...a11yProps(1)} />
                    <Tab label="UGPC_Members" {...a11yProps(2)} />
                    <Tab label="Other Users" {...a11yProps(3)} />
                </Tabs>

                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {
                            userContext.user.users.isLoading ? <CircularLoading/>  :
                                <RenderStudents students={userContext.user.users.allUsers.filter(users => users._id === 'Student')[0]}/>
                        }

                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {
                            userContext.user.users.isLoading ? <CircularLoading/>  :
                                <RenderSupervisors supervisors={userContext.user.users.allUsers.filter(users => users._id === 'Supervisor')[0]}/>
                        }

                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        {
                            userContext.user.users.isLoading ? <CircularLoading/>  :
                                <RenderUGPCMembers ugpcMembers={userContext.user.users.allUsers.filter(users => users._id === 'UGPC_Member')[0]}/>
                        }

                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        {
                            userContext.user.users.isLoading ? <CircularLoading/>  :
                                <RenderOfficeUsers chairmanOffice={userContext.user.users.allUsers.map(users => {
                                    if (users._id === 'Chairman DCSSE' || users._id === 'Chairman_Office' || users._id === 'Program_Office'){
                                        return users
                                    }
                                }).filter(f => f !== undefined)}/>
                        }

                    </TabPanel>
                </SwipeableViews>
            </div>
        </div>
    );
};

export default React.memo(UsersMainComponent);