import React, {useState, useEffect, useContext} from 'react';

import {
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput, TextField,
  InputAdornment,
} from "@material-ui/core";
import {Assignment, Search} from '@material-ui/icons';
import {useListContainerStyles} from "../../../../src/material-styles/listContainerStyles";
import VisionDocListItem from "./VisionDocListItem";
import VisionDocsContext from "../../../../context/visionDocs/visionDocs-context";


const ListVisionDocs = ({docs}) => {
  const visionDocsContext = useContext(VisionDocsContext);
  const classes = useListContainerStyles();
  const [status, setStatus] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState([]);
  useEffect(() => {
    let data = [];
    docs.map(doc => {
      doc.projects.map(project => {
        data = [...data, project]
      })
    });
    setDocuments(data);
    setFilter(data);
  }, [docs]);
  const handleChange = (event) => {
    setStatus(event.target.value);
    let data = [];
    switch (event.target.value) {
      case 'All':
        docs.map(doc => {
          doc.projects.map(project => {
            data = [...data, project]
          })
        });
        setDocuments(data);
        setFilter(data);
        break;
      case event.target.value :
        docs.map(doc => {
          if (doc._id.status === event.target.value) {
            doc.projects.map(project => {
              data = [...data, project]
            })
          }
        });
        setDocuments(data);
        setFilter(data);
        break;
    }
  };
  const handleChangeSearch = e => {
    const data = documents;
    setFilter(e.target.value !== '' ? data.filter(doc => doc.documentation.visionDocument.title.toLowerCase().includes(e.target.value.toLowerCase())) : documents)
  };

  return (
    <div className={classes.listContainer}>
      <div className={classes.top}>
        <div className={classes.topIconBox}>
          <Assignment className={classes.headerIcon}/>
        </div>
        <div className={classes.topTitle}>
          <Typography variant='h5'>Vision Documents</Typography>
        </div>

      </div>
      <div>
        <div className={classes.listHeader}>
          <FormControl variant="outlined" margin='dense' className={classes.formControl}>
            <InputLabel htmlFor="status">
              Status
            </InputLabel>
            <Select
              value={status}
              onChange={handleChange}
              input={<OutlinedInput labelWidth={47} name="status" id="status"/>}
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Waiting for Initial Approval'>Waiting for Initial Approval</MenuItem>
              <MenuItem value='Approved for Meeting'>Approved for Meeting</MenuItem>
              <MenuItem value='Meeting Scheduled'>Meeting Scheduled</MenuItem>
              <MenuItem value='Approved With Changes'>Approved With Changes</MenuItem>
              <MenuItem value='Approved'>Approved</MenuItem>
              <MenuItem value='Rejected'>Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            label="Search"
            name='search'
            margin='dense'
            placeholder='Search For Projects'
            onChange={handleChangeSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search/>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Divider/>
        {
          visionDocsContext.visionDocs.errMess === null ?
            <VisionDocListItem
              filter={filter}
            />
            :
            <Typography variant='h5' style={{textAlign: "center"}}
                        color='error'>{visionDocsContext.visionDocs.errMess}</Typography>
        }

      </div>
    </div>

  );
};

export default ListVisionDocs;