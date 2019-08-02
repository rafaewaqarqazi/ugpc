import React from 'react';
import Typography from "@material-ui/core/Typography";

const CopyrightComponent = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            &copy;{` Copyright- The Geek's Crew ${(new Date().getFullYear())}`}
        </Typography>
    );
};

export default CopyrightComponent;