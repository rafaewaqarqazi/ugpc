import {makeStyles} from "@material-ui/styles";

export const useListContainerStyles = makeStyles(theme=>({
    listContainer:{
        padding:theme.spacing(2,2,10,2),
        marginTop: theme.spacing(8),
        boxShadow: theme.shadows[10],
        marginBottom: theme.spacing(5),
        borderRadius:5
    },
    top:{
        display: 'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        marginBottom:theme.spacing(5),
    },
    topIconBox:{
        width: theme.spacing(11),
        height:theme.spacing(11),
        backgroundColor: theme.palette.secondary.dark,
        color:'#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        boxShadow:theme.shadows[10],
        marginTop:-theme.spacing(5),
        borderRadius:2
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
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    headerIcon:{
        width: theme.spacing(7),
        height: theme.spacing(7)
    }
}));