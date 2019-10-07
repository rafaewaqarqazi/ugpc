import React from 'react';
import {Grid,Typography} from "@material-ui/core";

const ProfileStudentDetails = ({studentDetails,department}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6} >
                <Typography color='textSecondary'>Department: </Typography>
                <Typography color='textSecondary'>Batch: </Typography>
                <Typography color='textSecondary'>Registration No: </Typography>
                <Typography color='textSecondary'>Eligibility: </Typography>
            </Grid>
            <Grid item xs={6} >
                <Typography color='textSecondary'>{department}</Typography>
                <Typography color='textSecondary'>{studentDetails.batch}</Typography>
                <Typography color='textSecondary' noWrap>{studentDetails.regNo}</Typography>
                <Typography color='textSecondary'>{studentDetails.isEligible}</Typography>
            </Grid>
        </Grid>
    );
};

export default ProfileStudentDetails;