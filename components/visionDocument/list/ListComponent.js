import React,{useState} from 'react';
import {
    Hidden,
    Typography,
    Badge,
    Grid,
    Chip
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {AttachFile} from '@material-ui/icons';
import {grey} from "@material-ui/core/colors";

const useStyles = makeStyles(theme =>({
    paper:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:theme.spacing(2),
        padding:theme.spacing(1),
        backgroundColor:grey[200],
        boxShadow:theme.shadows[5],
        minWidth:300
    },

}));
const ListComponent = ({visionDocuments, projectName}) => {
    const classes = useStyles();
    return (
        <Grid>

            {visionDocuments && visionDocuments.map((document, index) =>
                <Grid item key={document._id} sm={8} xs={8}>
                    <Hidden mdUp>
                        <div  className={classes.paper}>
                            <Typography variant='body2'>{document.title}</Typography>
                            <Chip color='primary' label={document.status}  size="small"/>
                        </div>
                    </Hidden>
                    <Hidden smDown>
                        <div  className={classes.paper}  >
                            <Typography color='primary' variant='body2'>
                                {projectName}
                            </Typography>
                            <Typography  variant='body2' >
                                {document.title}
                            </Typography>
                            <Chip color='primary' label={document.status}  size="small"/>
                            <Badge color="secondary" className={classes.margin} badgeContent={document.comments.length === 0?'0':document.comments.length}>
                                <Typography  variant='body2'>Comments</Typography>
                            </Badge>

                        </div>
                    </Hidden>

                </Grid>
            )}

        </Grid>
    );
};

export default ListComponent;