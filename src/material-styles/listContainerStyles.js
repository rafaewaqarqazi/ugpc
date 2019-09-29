import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "./randomColors";

export const useListContainerStyles = makeStyles(theme=>({
    listContainer:{
        padding:theme.spacing(2,2,10,2),
        marginTop: theme.spacing(8),
        boxShadow: theme.shadows[1],
        marginBottom: theme.spacing(5),
        borderRadius:5,
        backgroundColor: '#fff',
        minHeight:450
    },
    top:{
        display: 'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',

        marginBottom:theme.spacing(5),
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            flexDirection:'row',
            justifyContent:'flex-start',
            marginBottom:theme.spacing(5),
        }
    },
    topIconBox:{
        minWidth: theme.spacing(11),
        minHeight:theme.spacing(11),
        backgroundColor: getRandomColor(),
        color:'#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        boxShadow:theme.shadows[2],
        marginTop:-theme.spacing(5),
        borderRadius:5
    },
    topTitle:{
        flexGrow:1,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'column',

        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing(1.2),
            display:'flex',
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems: 'center',
        }
    },
    formControl: {
        minWidth: 160,
    },
    headerIcon:{
        width: 36,
        height: 36
    }
}));