import {makeStyles} from "@material-ui/core";
import {green} from "@material-ui/core/colors";

export const useSnakBarStyles = makeStyles(theme => ({
    error:{
        backgroundColor: theme.palette.error.dark,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    iconVariant: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    root: {
        maxWidth: 650,
    },
    success: {
        margin: theme.spacing(1),
        backgroundColor:green[600]
    },
    info:{
        backgroundColor: theme.palette.primary.main
    }
}));