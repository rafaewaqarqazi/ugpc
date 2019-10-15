import {makeStyles} from "@material-ui/styles";

export const useSwitchStyles = makeStyles(theme =>({
    root: {
        "& $notchedOutline": {
            borderColor: "#00acc1"
        },
        "&:hover $notchedOutline": {
            borderColor: "#00acc1"
        },
        "&$focused $notchedOutline": {
            borderColor: "#00acc1"
        }
    },
    focused: {},
    notchedOutline: {}
}));