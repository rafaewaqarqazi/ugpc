import React, {useState} from 'react';
import {LaptopOutlined} from "@material-ui/icons";
import {Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import CircularLoading from "../../loading/CircularLoading";
import {Chart} from "react-google-charts";
import {formatProjectsData} from "../../chairman/dashboard/values";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {useProgressStyles} from "../../../src/material-styles/ProgressStyles";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";

const ProjectsGantt = ({projects}) => {
  const classes = useListContainerStyles();
  const emptyClasses = useListItemStyles();
  const progressClasses = useProgressStyles();
  const [empty, setEmpty] = useState(false);
  const handleError = error => {
    setEmpty(true)
  };
  return (
    <div className={progressClasses.container}>
      <div className={progressClasses.top}>
        <div>
          <div className={classes.topIconBox}>
            <LaptopOutlined className={classes.headerIcon}/>
          </div>
        </div>
        <div className={progressClasses.containerContent}>
          <Typography variant='body1' color='textSecondary'>Projects</Typography>
          {
            !projects.isLoading &&
            <Typography variant='h5' color='textSecondary'>{projects.projects.length}</Typography>
          }


        </div>
      </div>
      <Divider/>
      <div className={progressClasses.topProgressBarContainer}>
        {
          projects.isLoading ? <CircularLoading/> :
            !empty ?
              <Chart
                width={'100%'}
                height={(formatProjectsData(projects.projects).projectsData.length + 1) * 40}
                chartType="Gantt"
                legendToggle
                loader={<CircularLoading/>}
                chartEvents={[
                  {
                    eventName: 'error',
                    callback: handleError
                  }
                ]}
                data={formatProjectsData(projects.projects).data}
                options={{
                  gantt: {
                    trackHeight: 30,
                    criticalPathEnabled: false,
                  }
                }}
                rootProps={{'data-testid': '1'}}
              />
              :
              (
                <div style={{width: '100%'}}>
                  <div className={emptyClasses.emptyList}>
                    <div className={emptyClasses.emptyListContainer}>
                      <div className={emptyClasses.emptyList}>
                        <Typography variant='subtitle2' color='textSecondary'>
                          No Projects Found!
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              )
        }
      </div>

    </div>
  );
};

export default ProjectsGantt;