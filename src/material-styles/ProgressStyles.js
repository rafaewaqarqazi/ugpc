import {makeStyles} from "@material-ui/styles";

export const useProgressStyles = makeStyles(theme => ({
    title:{
        marginTop:theme.spacing(2),
        marginBottom:theme.spacing(5),
        fontSize:24
    },
    container:{
        padding:theme.spacing(2),
        marginTop: theme.spacing(5),
        boxShadow: theme.shadows[1],
        borderRadius:5,
        backgroundColor: '#fff'
    },
    containerContent:{
        flexGrow:1,
        paddingLeft:theme.spacing(1),
        textAlign:'right'
    },
    top:{
        display:'flex',
        marginBottom: theme.spacing(1)
    },
    topProgressBarContainer:{
        paddingTop: theme.spacing(1),
        display: 'flex',
        flexDirection:'row',
        flexGrow: 1
    },
    progressBar:{
        height:10,
        borderRadius: 10
    }
}))