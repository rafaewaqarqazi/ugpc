import {makeStyles} from "@material-ui/styles";
import {getRandomColor} from "./randomColors";

export const useListItemStyles = makeStyles(theme =>({
    emptyListContainer:{
        border:'1.7px dashed grey',
        marginTop:theme.spacing(2),
        borderRadius:5,
        width:'100%',
        padding:theme.spacing(5),
    },
    emptyList:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center'
    },
    listItemContainer:{
        marginTop:theme.spacing(2)
    },
    listItem:{
        cursor:'pointer',
        '&:hover':{
            boxShadow:theme.shadows[6],
        },
        marginTop:theme.spacing(0.2)
    },
    badgeMargin: {
        margin: theme.spacing(0.5),
    },
    badgeColor:{
        backgroundColor:getRandomColor(),
        color: theme.palette.background.paper
    },
    badgePadding: {
        padding: theme.spacing(0, 1),
    },
    avatar:{
        width:30,
        height:30,
        margin:theme.spacing(1),
        backgroundColor:getRandomColor(),
    },
    grid1:{
        display:'flex',
        backgroundColor:getRandomColor(),
        flexDirection: 'column',
        padding:theme.spacing(0.2),
        justifyContent: 'space-between',
        alignItems: 'center',
        height:theme.spacing(15),
        color:theme.palette.background.paper,
        [theme.breakpoints.up('sm')]: {
            display:'flex',
            flexDirection: 'column',
            padding:theme.spacing(0.2),
            justifyContent: 'space-between',
            alignItems: 'center',
            height:'100%',
            color:theme.palette.background.paper,
        }
    },
    wrapText:{
        display:'-webkit-box',
        '-webkit-line-clamp':2,
        '-webkit-box-orient': 'vertical',
        overflow:'hidden',
        textOverflow:'ellipsis',
        marginTop:theme.spacing(1)
    },
    lastGrid:{
        display:'flex',
        flexDirection: 'row',
        padding:theme.spacing(1),
        justifyContent: 'space-between',
        alignItems: 'center',
        height:'100%',
        [theme.breakpoints.up('sm')]: {
            display:'flex',
            flexDirection: 'column',
            padding:theme.spacing(1),
            justifyContent: 'space-between',
            alignItems: 'center',
            height:'100%',
        }
    },
    gridTransition:{
        transition: theme.transitions.create("all", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard
        })
    }
}))