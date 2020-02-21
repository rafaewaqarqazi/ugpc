import React, {useEffect} from "react";
import {
  Typography,
  Container,
} from "@material-ui/core";
import {PictureAsPdfOutlined, Assignment} from '@material-ui/icons';
import {serverUrl} from "../../../utils/config";
import {useDocDetailsDialogStyles} from "../../../src/material-styles/docDetailsDialogStyles";

export const RenderDocumentAttachments = ({documents}) => {
  const classes = useDocDetailsDialogStyles();
  useEffect(() => {
  }, [documents])
  return (
    <div className={classes.detailsContent}>
      <Typography variant='subtitle2'>
        Documents
      </Typography>
      <div>
        <Container>
          <Typography noWrap>Vision Docs</Typography>
          <div className={classes.documentsList}>
            {
              documents.map((document) => {
                if (document.type === 'application/pdf') {
                  return (
                    <div className={classes.document} key={document.filename}>
                      <a href={`${serverUrl}/../pdf/${document.filename}`} target="_blank">
                        <PictureAsPdfOutlined style={{width: 50, height: 50}}/>
                      </a>
                    </div>
                  )
                }

              })
            }
          </div>
        </Container>
      </div>
      <div>
        <Container>
          <Typography noWrap>Presentation</Typography>
          <div className={classes.documentsList}>
            {
              documents.map(document => {
                if (document.type === 'application/vnd.ms-powerpoint' || document.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                  return (
                    <div className={classes.document} key={document.filename}>
                      <a key={document.filename} href={`${serverUrl}/../presentation/${document.filename}`}
                         target="_blank">
                        <Assignment style={{width: 50, height: 50}}/>
                      </a>
                    </div>
                  )
                }

              })
            }
          </div>
        </Container>
      </div>
    </div>
  )
}