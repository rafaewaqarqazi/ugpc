import {makeStyles} from "@material-ui/core";

export const usePendingStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        marginBottom:theme.spacing(4),
        width: 150,
        height: 150,
        [theme.breakpoints.down('xs')]:{
            marginBottom:theme.spacing(3),
            width: 125,
            height: 125,
        },

    },
    message:{
        fontSize:30,
        [theme.breakpoints.down('sm')]:{
            fontSize:20
        },
        [theme.breakpoints.down('xs')]:{
            fontSize:16
        }
    },
    notEligible:{
        color: theme.palette.error.dark
    }
}));