import React from 'react';
import {Container, LinearProgress} from "@material-ui/core";
import {ListAltOutlined,ViewColumnOutlined} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import ProjectContext from "../../context/project/project-context";
import {useListContainerStyles} from "../../src/material-styles/listContainerStyles";
import {useListItemStyles} from "../../src/material-styles/listItemStyles";

const ApprovalChecker = ({children,title}) => {
    const classes = useListContainerStyles();
    const classesEmpty = useListItemStyles()
    return (
        <ProjectContext.Consumer>
            {
                ({project}) => (
                    <Container>
                        {
                            project.isLoading ? <LinearProgress/> :
                                <div className={classes.listContainer}>
                                    <div className={classes.top}>
                                        <div className={classes.topIconBox} >
                                            {
                                                title==='Backlogs' && <ListAltOutlined className={classes.headerIcon}/>
                                            }
                                            {
                                                title === 'Scrum Board' && <ViewColumnOutlined className={classes.headerIcon}/>
                                            }
                                        </div>
                                        <div className={classes.topTitle} >
                                            <Typography variant='h5'>{title}</Typography>
                                        </div>
                                    </div>
                                    {
                                        !project.project[0].details.acceptanceLetter ? (

                                            <div className={classesEmpty.emptyListContainer}>
                                                <div className={classesEmpty.emptyList}>
                                                    <Typography variant='subtitle2' color='textSecondary'>
                                                        Please Wait while your Project is Approved
                                                    </Typography>
                                                </div>
                                            </div>

                                        ):(
                                            <div>{children}</div>
                                        )
                                    }
                                </div>
                        }
                    </Container>
                )
            }
        </ProjectContext.Consumer>
    );
};

export default ApprovalChecker;