import StudentPanelLayout from "../../../components/Layouts/StudentPanelLayout";
import StudentVisionDocumentListComponent from "../../../components/visionDocument/list/StudentVisionDocumentListComponent";
import ProjectState from "../../../context/project/ProjectState";
import {withStudentAuthSync} from "../../../components/routers/studentAuth";
import VisionDocsState from "../../../context/visionDocs/VisionDocsState";
import ProjectContext from '../../../context/project/project-context';
import SwipeableViews from 'react-swipeable-views';
import {
    Container,
    Typography,
    LinearProgress,
    Tabs,
    Tab,
    Box
} from "@material-ui/core";
import {Assignment} from "@material-ui/icons";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import {makeStyles, useTheme} from "@material-ui/styles";
import StudentFinalDocumentationComponent
    from "../../../components/project/finalDocumentation/StudentFinalDocumentationComponent";

const useStyles = makeStyles(theme => ({
    container:{
        marginTop:theme.spacing(5),
    }
}));
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
const Documentation = () => {
    const listContainerStyles = useListContainerStyles();
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    return (
        <ProjectState>
            <VisionDocsState>
                <StudentPanelLayout>
                    <ProjectContext.Consumer>
                        {
                            ({project}) => (
                                project.isLoading? <LinearProgress/>: (
                                    <Container className={classes.container}>
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
                                                    <StudentVisionDocumentListComponent/>
                                                </TabPanel>
                                                <TabPanel value={value} index={1} dir={theme.direction}>
                                                    <StudentFinalDocumentationComponent/>
                                                </TabPanel>
                                            </SwipeableViews>
                                        </div>
                                    </Container>
                                )
                            )
                        }
                    </ProjectContext.Consumer>
                </StudentPanelLayout>
            </VisionDocsState>
        </ProjectState>
    );
};

export default withStudentAuthSync(Documentation);