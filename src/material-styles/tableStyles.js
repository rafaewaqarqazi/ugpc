import {makeStyles} from "@material-ui/styles";

export const useTableStyles = makeStyles(theme =>({
    tableRow:{
        "&:hover":{
            boxShadow:theme.shadows[6]
        }
    },
    tableWrapper:{
        padding:theme.spacing(0.5),
        overflow:'auto',
        maxHeight:450
    }
}));