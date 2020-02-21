import {
  Chip,
  Typography
} from "@material-ui/core";
import React from "react";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";
import RenderStudents from "./RenderStudents";

export const RenderDocBasicDetails = ({currentDocument, project}) => {
  const classes = useDocDetailsDialogStyles();
  return (
    <div>
      <div className={classes.detailsContent}>
        <Typography variant='subtitle2'>
          Abstract
        </Typography>
        <Typography variant='body2' className={classes.wrapText}>
          {currentDocument.abstract}
        </Typography>
      </div>
      <div className={classes.detailsContent}>
        <Typography variant='subtitle2'>
          Scope
        </Typography>
        <Typography variant='body2' className={classes.wrapText}>
          {currentDocument.scope}
        </Typography>
      </div>
      <div className={classes.detailsContent}>
        <Typography variant='subtitle2'>
          Major Modules
        </Typography>
        {
          currentDocument.majorModules.map((module, index) =>
            <Chip key={index} color='primary' variant='outlined' label={module} className={classes.majorModules}/>
          )
        }

      </div>
      {
        project.details.supervisor &&
        <div className={classes.detailsContent}>
          <Typography variant='subtitle2'>
            Supervisor
          </Typography>
          <Typography variant='body2' className={classes.wrapText}>
            {project.details.supervisor.name} - {project.details.supervisor.supervisor_details && project.details.supervisor.supervisor_details.position}
          </Typography>
        </div>
      }

      <div className={classes.detailsContent}>
        <RenderStudents students={project.students}/>
      </div>
    </div>
  )
}