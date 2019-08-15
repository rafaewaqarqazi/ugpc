import React,{useContext} from 'react';
import TitleComponent from "../../title/TitleComponent";
import ProjectContext from '../../../context/project/project-context';
import CircularLoading from "../../loading/CircularLoading";
import ListComponent from "./ListComponent";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    content:{
        marginTop:theme.spacing(8)
    }
}))
const VisionDocumentListComponent = () => {
    const context = useContext(ProjectContext);
    console.log(context);
    const classes = useStyles();
    return (
        <div>
            <TitleComponent title='Your Vision Docs'/>
            {context.project.isLoading ? <CircularLoading/> :
                <div className={classes.content}>
                    <ListComponent visionDocuments={context.project.project[0].documentation.visionDocument} projectName={context.project.project[0].title}/>
                </div>

            }
        </div>
    );
};

export default VisionDocumentListComponent;