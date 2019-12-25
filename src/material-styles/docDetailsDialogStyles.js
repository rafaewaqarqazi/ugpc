import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "./randomColors";
import {green} from "@material-ui/core/colors";

export const useDocDetailsDialogStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    detailsContent:{
        marginBottom:theme.spacing(2)
    },
    document: {
        cursor:'pointer',
        width:70,
        height:70,
        border:'1px solid lightgrey',
        borderRadius:2,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        "&:hover":{
            boxShadow:theme.shadows[2]
        },
        '& a':{
            textDecoration:'none',
            color:'#9E9E9E'
        },
        marginRight:theme.spacing(1)
    },
    documentsList:{
        display: 'flex',
        padding: theme.spacing(1),
        flexWrap: 'wrap'
    },

    commentList:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    majorModules:{
        marginRight:theme.spacing(0.5)
    },
    wrapText:{
        maxWidth:400,
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },
    avatar:{
        backgroundColor:getRandomColor()
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        color:theme.palette.background.paper
    },
}));