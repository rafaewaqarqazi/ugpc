import {Badge, Chip, Grid, Tooltip, Typography, Zoom} from "@material-ui/core";
import moment from "moment";
import {getVisionDocsStatusChipColor} from "../../../src/material-styles/visionDocsListBorderColor";
import React from "react";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import UserAvatarComponent from "../../UserAvatarComponent";

export const RenderListItemContent = ({doc, project}) => {
  console.log(doc)
  const classes = useListItemStyles();
  return (
    <Grid container spacing={1} className={classes.listItem}>
      <Grid item xs={12} sm={2} className={classes.gridTransition}>
        <div className={classes.grid1}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {
              project.students.map((student, index) => (
                <UserAvatarComponent user={student} key={index}/>
              ))
            }
          </div>
          <Tooltip title='Created On' placement="top" TransitionComponent={Zoom}>
            <Typography variant="body2"
                        style={{textAlign: 'center'}}>{moment(doc.uploadedAt).format('MMM D, YYYY')}</Typography>
          </Tooltip>
        </div>
      </Grid>
      <Grid item xs={12} sm={8} className={classes.gridTransition} style={{display: 'flex'}}>
        <div style={{textAlign: 'center'}}>
          <Typography variant='h6' noWrap>{doc.title}</Typography>
          <Chip style={getVisionDocsStatusChipColor(doc.status)} label={doc.status} size="small"/>
        </div>
        <div style={{paddingLeft: '20px'}}>
          <Tooltip title='Abstract' placement="top" TransitionComponent={Zoom}>
            <Typography className={classes.wrapText} variant="body2" color="textSecondary"
                        component="p">{doc.abstract}</Typography>
          </Tooltip>
        </div>
      </Grid>
      <Grid item xs={12} sm={2} className={classes.gridTransition}>
        <div className={classes.lastGrid}>
          <Badge badgeContent={doc.comments.length > 0 ? doc.comments.length : '0'} max={10} color='secondary'
                 className={classes.badgeMargin}>
            <Typography className={classes.badgePadding} noWrap>
              Comments</Typography>
          </Badge>
          <Badge badgeContent={doc.majorModules.length} max={10} color='secondary' className={classes.badgeMargin}>
            <Typography className={classes.badgePadding} noWrap>Modules</Typography>
          </Badge>
        </div>

      </Grid>
    </Grid>
  )
}