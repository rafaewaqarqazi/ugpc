import React, {Fragment, useEffect, useState} from 'react';
import {
    Avatar,
    Collapse, Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    List,
    ListItem, ListItemAvatar, ListItemText, makeStyles,
    Radio,
    RadioGroup,
    TextField, Typography,
} from "@material-ui/core";

import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {fetchNotEnrolledStudents} from "../../utils/apiCalls/students";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    formControl:{
        marginTop: theme.spacing(2)
    },
    group:{
        display:'flex',
        flexDirection:'row',
    }
}));

const CreateProjectDetailsComponent = ({data, setData,error, setErrors,value,setValue,selectedIndex,setSelectedIndex}) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleChange = (event)=> {
        setValue(event.target.value);
        setData({...data, team:event.target.value});
    };
    const [studentsList,setStudents] = useState({
        loading:true,
        list:[]
    });

    const handleClick=()=> {
        setOpen(!open);
    };
    useEffect(()=>{
        fetchNotEnrolledStudents()
            .then(students=>{
                setStudents({
                    loading:false,
                    list:students
                })
            })
    },[]);

    const handleListItemClick = index => event => {
        setSelectedIndex(index);
        setData({...data,partnerId:studentsList.list[index]._id});
    };
    const handleChangeDesc = e =>{
        setErrors({
            ...error,
            description: {
                show:false,
                message:''
            }
        });
        setData({...data, description:e.target.value})
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={10} md={8}>
                <TextField
                    variant='outlined'
                    label='Description'
                    fullWidth
                    name='description'
                    placeholder='Project description here'
                    multiline
                    rows={4}
                    required
                    value={data.description}
                    onChange={handleChangeDesc}
                    error={error.description.show}
                    helperText={error.description.message}
                />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Team</FormLabel>
                    <RadioGroup
                        aria-label="Mode"
                        name="mode"
                        className={classes.group}
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="solo" control={<Radio />} label="Solo" />
                        <FormControlLabel value="duo" control={<Radio />} label="Duo" />

                    </RadioGroup>
                </FormControl>
            </Grid>
            {
                value==='duo' && <Grid item xs={12} sm={10} md={8}>
                    <List >
                        <ListItem button onClick={handleClick}>
                            <ListItemText primary="Choose Partner" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.root}>
                                {
                                    studentsList.list.length === 0 ?
                                    <ListItem>
                                        <Typography variant='h5'>No Students Found</Typography>
                                    </ListItem>
                                       :
                                    studentsList.list.map((student,index)=>(
                                    <Fragment key={index}>
                                        <ListItem alignItems="flex-start"
                                                  selected={selectedIndex === index}
                                                  onClick={handleListItemClick(index)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar alt="Travis Howard" src="/static/images/avatar/iiui-logo.jpg" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={student.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="overline"
                                                            className={classes.inline}
                                                            color="textPrimary"
                                                        >
                                                            {student.student_details.regNo}
                                                        </Typography>

                                                        {` — ${student.email}`}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </Fragment>
                                ))}

                            </List>
                        </Collapse>
                    </List>

                </Grid>
            }
            <Grid item xs={12} sm={10} md={8}>
                {error.partnerId.show && <Typography component='span' color='error' variant='caption'>{error.partnerId.message}</Typography> }
            </Grid>
        </Grid>
    );
};

export default CreateProjectDetailsComponent;