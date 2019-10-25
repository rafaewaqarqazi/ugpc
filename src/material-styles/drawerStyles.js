import {makeStyles} from "@material-ui/styles";
import {blue} from "@material-ui/core/colors";
import {getRandomColor} from "./randomColors";

const drawerWidth = 250;
export const useDrawerStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    switch:{
        "& $notchedOutline": {
            borderColor: "#fff"
        }
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',

    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(6) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    appBar: {

        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarContent:{
      display:'flex',
      flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        flexGrow: 1
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
    },
    side:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'flex-start',
        height:'100%'
    },
    sidebar:{
        minWidth: theme.spacing(8) ,
        [theme.breakpoints.up('sm')]: {
            minWidth: theme.spacing(8),
        },
        backgroundColor:blue[900],
        height: '100%',
    },
    menuRightButton:{
        display:'flex',
        justifyContent:'center',
        marginTop:theme.spacing(1),
    },
    list:{
        backgroundColor:'rgba(0,0,0,.8)',
        width:'100%',
        height:'100%',
        color:'rgba(255,255,255,0.87)',
        padding:theme.spacing(0,2,3,1.5),
    },
    drawerListItem:{
        padding:theme.spacing(1),
        marginTop:theme.spacing(2),
        borderRadius:3,
        color:'rgba(255,255,255,0.87)',
        '&:hover':{
            backgroundColor:'#00acc1'
        }
    },
    profile:{
      marginLeft:theme.spacing(1),
    },
    drawerListItemActive:{
        backgroundColor:'#00acc1',
        padding:theme.spacing(1),
        marginTop:theme.spacing(2),
        borderRadius:3,
        color:'rgba(255,255,255,0.87)',
        '&:hover':{
            backgroundColor:'#00acc1'
        }
    },
    iconColor:{
        color:'rgba(255,255,255,0.87)',
    },
    sideBarImage:{

      width:'100%',
      height:'100%',
        backgroundSize:'cover',
        backgroundPosition:'center'
    },
    menuRightTopContent:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        marginTop:theme.spacing(3),
    },
    blank:{
        marginTop:theme.spacing(6),
    },
    menus:{
        display:'flex',
        flexDirection:'column',
        height:'85%',
        [theme.breakpoints.up('sm')]: {
            height: '90%',
        },
    },
    avatarMargin:{
        marginBottom:theme.spacing(2)
    },
    avatarDrawer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:theme.spacing(1.5)
    },
    avatarColor:{
        backgroundColor:getRandomColor(),
        width:32,
        height:32,
        fontSize:16,
        marginRight:theme.spacing(0.3)
    },
    profileAvatarColor:{
        backgroundColor:getRandomColor()
    },
    imageAvatar:{
        width:32,
        height:32,
        marginRight:theme.spacing(0.3)
    },
    avatarSize:{
        width:100,
        height:100,
        fontSize:32,
    },

}));
