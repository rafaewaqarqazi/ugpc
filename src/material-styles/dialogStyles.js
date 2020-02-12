import {makeStyles} from "@material-ui/styles";

export const useDialogStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            margin: 0,
            width: '100%'
        }
    }
}));