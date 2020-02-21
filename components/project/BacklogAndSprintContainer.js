import React, {useContext} from 'react';
import {LinearProgress} from "@material-ui/core";
import {ListAltOutlined, ViewColumnOutlined} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import ProjectContext from "../../context/project/project-context";
import UserContext from '../../context/user/user-context';
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";

const BacklogAndSprintContainer = ({children, title}) => {
  const classes = useListContainerStyles();
  const classesEmpty = useListItemStyles();
  const userContext = useContext(UserContext);
  return (
    <ProjectContext.Consumer>
      {
        ({project}) => (
          project.isLoading ? <LinearProgress/> :
            <div className={classes.listContainer}>
              <div className={classes.top}>
                <div className={classes.topIconBox}>
                  {
                    title === 'Backlog' && <ListAltOutlined className={classes.headerIcon}/>
                  }
                  {
                    title === 'Scrum Board' && <ViewColumnOutlined className={classes.headerIcon}/>
                  }
                </div>
                <div className={classes.topTitle}>
                  <Typography variant='h5'>{title}</Typography>
                </div>
              </div>
              {
                userContext.isLoading ? <LinearProgress/> :
                  userContext.user.user.role === 'Student' ?
                    !project.project.details.acceptanceLetter ? (

                      <div className={classesEmpty.emptyListContainer}>
                        <div className={classesEmpty.emptyList}>
                          <Typography variant='subtitle2' color='textSecondary'>
                            Please Wait while your Project is Approved
                          </Typography>
                        </div>
                      </div>

                    ) : (
                      <div>{children}</div>
                    )
                    :
                    <div>{children}</div>
              }
            </div>
        )
      }
    </ProjectContext.Consumer>
  );
};

export default BacklogAndSprintContainer;