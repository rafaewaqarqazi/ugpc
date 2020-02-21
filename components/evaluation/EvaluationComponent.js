import React, {useContext, useEffect, useState} from 'react';
import {Box, Container, Tab, Tabs, Typography} from "@material-ui/core";
import {PlaylistAddCheckOutlined} from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import CircularLoading from "../loading/CircularLoading";
import RenderInternalsExternals from "./RenderInternalsExternals";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import UserContext from "../../context/user/user-context";
import {useTheme} from "@material-ui/styles";
import {fetchAssignedForEvaluationProjects} from "../../utils/apiCalls/projects";

const TabPanel = props => {
  const {children, value, index, ...other} = props;

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
};
const EvaluationComponent = () => {
  const classes = useListContainerStyles();
  const userContext = useContext(UserContext);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState({});
  const fetchData = () => {
    setLoading(true);
    fetchAssignedForEvaluationProjects()
      .then(result => {
        console.log(result);
        if (result.error) {
          console.log('Error: ', result.error);
          setLoading(false);
          return;
        }
        setProjects(result.projects);
        setMarks(result.marks);
        setLoading(false);
      })
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };
  return (
    <Container>
      <div className={classes.listContainer}>
        <div className={classes.top}>
          <div className={classes.topIconBox}>
            <PlaylistAddCheckOutlined className={classes.headerIcon}/>
          </div>
          <div className={classes.topTitle}>
            <Typography variant='h5'>Evaluation</Typography>
          </div>

        </div>

        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
        >
          <Tab label="Internal" {...a11yProps(0)} />
          <Tab label="External" {...a11yProps(1)} />
        </Tabs>

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {
              loading ? <CircularLoading/> :
                !userContext.user.isLoading &&
                <RenderInternalsExternals
                  projects={projects.filter(project => project.details.internal && project.details.internal.examiner === userContext.user.user._id)}
                  marks={marks}
                  type='internal'
                  fetchData={fetchData}
                />
            }
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {
              loading ? <CircularLoading/> :
                !userContext.user.isLoading &&
                <RenderInternalsExternals
                  projects={projects.filter(project => project.details.external && project.details.external.examiner === userContext.user.user._id)}
                  marks={marks}
                  type='external'
                  fetchData={fetchData}
                />
            }
          </TabPanel>
        </SwipeableViews>
      </div>
    </Container>
  );
};

export default EvaluationComponent;