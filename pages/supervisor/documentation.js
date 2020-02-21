import {useState} from 'react';
import {withSupervisorAuthSync} from "../../components/routers/supervisorAuth";
import SupervisorLayout from "../../components/Layouts/SupervisorLayout";
import VisionDocsState from "../../context/visionDocs/VisionDocsState";
import SupervisorVisionDocs from "../../components/visionDocument/SupervisorVisionDocs";
import {Assignment} from "@material-ui/icons";
import {Box, Container, Tab, Tabs, Typography, Divider} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {useTheme} from "@material-ui/styles";
import SupervisorFinalDocumentation from "../../components/project/finalDocumentation/SupervisorFinalDocumentation";


const TabPanel = props => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={2}>{children}</Box>
    </div>
  );
};
const a11yProps = index => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
};
const Documentation = () => {
  const listContainerStyles = useListContainerStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };
  return (
    <VisionDocsState>
      <SupervisorLayout>
        <Container>
          <div className={listContainerStyles.listContainer}>
            <div className={listContainerStyles.top}>
              <div className={listContainerStyles.topIconBox}>
                <Assignment className={listContainerStyles.headerIcon}/>
              </div>
              <div className={listContainerStyles.topTitle}>
                <Typography variant='h5'>Documentation</Typography>
              </div>
            </div>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Vision Documents" {...a11yProps(0)} />
              <Tab label="Final Documentation" {...a11yProps(1)} />
            </Tabs>

            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Divider/>
                <SupervisorVisionDocs/>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Divider/>
                <SupervisorFinalDocumentation/>
              </TabPanel>
            </SwipeableViews>
          </div>
        </Container>

      </SupervisorLayout>
    </VisionDocsState>
  );
};

export default withSupervisorAuthSync(Documentation);