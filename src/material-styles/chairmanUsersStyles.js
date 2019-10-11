import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "./randomColors";
import {green} from "@material-ui/core/colors";

export const useChairmanUsersStyles = makeStyles(theme => ({
    table:{
        backgroundColor:'#fff',
        marginTop:theme.spacing(2),
        padding:theme.spacing(2),
        borderRadius:5
    },
    greenChip:{
        backgroundColor: green[500],
        color:'#fff'
    },
    dangerChip:{
        backgroundColor: theme.palette.error.dark,
        color:'#fff'
    },
    header:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    userNumbers:{
        marginLeft:theme.spacing(2)
    }
}));