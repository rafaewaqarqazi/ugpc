import {makeStyles} from "@material-ui/styles";

export const useListItemStyles = makeStyles(theme =>({
    listItemContainer:{
        marginTop:theme.spacing(2)
    },
    listItem:{
        display:'flex',
        cursor:'pointer',
    },
    listItemColor:{
        backgroundColor:theme.palette.secondary.light,
        minHeight:'100%',
        minWidth:theme.spacing(0.6)
    },
    listItemContent:{
        padding: theme.spacing(0.7),
        '&:hover':{
            boxShadow:theme.shadows[6],
        },
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    badgeMargin: {
        margin: theme.spacing(0.5),
    },
    badgePadding: {
        padding: theme.spacing(0, 1),
    },
}))