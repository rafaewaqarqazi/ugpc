import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Tabs, Tab, Box} from '@material-ui/core';
import RenderCommitteeDepartmentsComponent from "./RenderCommitteeDepartmentsComponent";
import SuccessSnackBar from "../../snakbars/SuccessSnackBar";
import UserContext from "../../../context/user/user-context";
import CircularLoading from "../../loading/CircularLoading";


function TabPanel(props) {
  const {children, value, index, ...other} = props;

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
    width: '100%'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const CommitteeTypeComponent = ({setSuccess, type}) => {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

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
      <TabPanel value={value} index={0} style={{flexGrow: 1}}>
        {

          userContext.user.committees.isLoading ? <CircularLoading/>
            :
            <RenderCommitteeDepartmentsComponent
              department='BSSE'
              members={userContext.user.committees.committeeType.filter(committee => committee._id === type)[0]}
              committeeType={type}
              setSuccess={setSuccess}
            />
        }

      </TabPanel>
      <TabPanel value={value} index={1} style={{flexGrow: 1}}>
        {
          userContext.user.committees.isLoading ? <CircularLoading/> :
            <RenderCommitteeDepartmentsComponent
              department='BSCS'
              members={userContext.user.committees.committeeType.filter(committee => committee._id === type)[0]}
              committeeType={type}
              setSuccess={setSuccess}
            />
        }

      </TabPanel>
      <TabPanel value={value} index={2} style={{flexGrow: 1}}>
        {
          userContext.user.committees.isLoading ? <CircularLoading/> :
            <RenderCommitteeDepartmentsComponent
              department='BSIT'
              members={userContext.user.committees.committeeType.filter(committee => committee._id === type)[0]}
              committeeType={type}
              setSuccess={setSuccess}
            />
        }

      </TabPanel>
    </div>
  );
};

export default CommitteeTypeComponent;