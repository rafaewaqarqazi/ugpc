import {makeStyles} from "@material-ui/styles";

export const useTableStyles = makeStyles(theme =>({
    listHeader:{
        paddingBottom: theme.spacing(1.2),
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
    tableRow:{
        "&:hover":{
            boxShadow:theme.shadows[6]
        }
    },
    tableWrapper:{
        flexGrow:1,
        padding:theme.spacing(0.5),
        overflow:'auto',
        maxHeight:450
    }
}));