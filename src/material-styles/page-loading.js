import {makeStyles} from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        marginBottom:theme.spacing(10),
        width: 150,
        height: 150,
    }
}));