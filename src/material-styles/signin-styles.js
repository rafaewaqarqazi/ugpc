import {makeStyles} from "@material-ui/styles";

export const useSignInStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: '#eee',
        },
    },
    paper: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        borderRadius:50
    },
    formControl: {
        minWidth:120,

    },
    root: {
        maxWidth: 600,
    }
}));