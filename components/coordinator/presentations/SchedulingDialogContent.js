import React, {useState} from 'react';
import {
    Collapse,
    FormControl,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Radio,
    RadioGroup, Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore, LocationOnOutlined, MeetingRoomOutlined} from "@material-ui/icons";
import {getClassRooms, getLabs, getOtherRooms} from "./rooms";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {makeStyles} from "@material-ui/styles";


const useStyles = makeStyles(theme =>({
    list:{
        overflow: 'auto',
        maxHeight: 300,
        width:'100%'
    },
    mainList:{
        overflow: 'auto',
        maxHeight: 400,
        width:'100%'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    nestedList: {
        paddingLeft: theme.spacing(6),

    },
}));

const SchedulingDialogContent = ({venue,setVenue,selectedDate,handleDateChange}) => {
    const classes = useStyles();
    const [openList,setOpenList] = useState(false);
    const [openClassRooms,setOpenClassRooms] = useState(false);
    const [openOtherRooms,setOpenOtherRooms] = useState(false);
    const [openLabs,setOpenLabs] = useState(false);
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <Typography color='textSecondary' variant='subtitle1'>Selected Venue: {venue}</Typography>
                <List className={classes.mainList}>
                    <ListItem button onClick={()=>setOpenList(!openList)}>
                        <ListItemIcon>
                            <LocationOnOutlined/>
                        </ListItemIcon>
                        <ListItemText primary="Show Venues" />
                        {openList ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button onClick={()=>setOpenClassRooms(!openClassRooms)} className={classes.nested}>
                                <ListItemIcon>
                                    <MeetingRoomOutlined/>
                                </ListItemIcon>
                                <ListItemText primary="Class Rooms" />
                                {openClassRooms ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openClassRooms} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className={classes.list}>
                                    <FormControl component="fieldset" style={{width:'100%'}}>
                                        <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                            {
                                                getClassRooms().map((classRoom,index) => (
                                                    <ListItem key={index} button className={classes.nestedList}>
                                                        <FormControlLabel  value={classRoom} control={<Radio />} label={classRoom} />
                                                    </ListItem>
                                                ))
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                </List>
                            </Collapse>

                            <ListItem button onClick={()=>setOpenLabs(!openLabs)} className={classes.nested}>
                                <ListItemIcon>
                                    <MeetingRoomOutlined/>
                                </ListItemIcon>
                                <ListItemText primary="Labs" />
                                {openLabs ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openLabs} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className={classes.list}>
                                    <FormControl component="fieldset" style={{width:'100%'}}>
                                        <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                            {
                                                getLabs().map((lab,index) => (
                                                    <ListItem key={index} button className={classes.nestedList}>
                                                        <FormControlLabel  value={lab} control={<Radio />} label={lab} />
                                                    </ListItem>
                                                ))
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                </List>
                            </Collapse>

                            <ListItem button onClick={()=>setOpenOtherRooms(!openOtherRooms)} className={classes.nested}>
                                <ListItemIcon>
                                    <MeetingRoomOutlined/>
                                </ListItemIcon>
                                <ListItemText primary="Other Rooms" />
                                {openOtherRooms ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openOtherRooms} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className={classes.list}>
                                    <FormControl component="fieldset" style={{width:'100%'}}>
                                        <RadioGroup name="venue" value={venue} onChange={(event => setVenue(event.target.value))}>
                                            {
                                                getOtherRooms().map((other,index) => (
                                                    <ListItem key={index} button className={classes.nestedList}>
                                                        <FormControlLabel  value={other} control={<Radio />} label={other} />
                                                    </ListItem>
                                                ))
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                </List>
                            </Collapse>
                        </List>
                    </Collapse>
                </List>
            </Grid>
            <Grid item xs={12} sm={6}>
                <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                    <DateTimePicker
                        label="Select Date&Time"
                        inputVariant="outlined"
                        value={selectedDate}
                        onChange={handleDateChange}
                        disablePast
                        fullWidth
                    />
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>
    );
};

export default SchedulingDialogContent;