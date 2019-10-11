import React, {Fragment, useState} from 'react';
import {
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Dialog,
    LinearProgress,
    DialogTitle,
    Zoom,
    DialogContent,
    DialogActions,
    ListItem,
    ListItemText,
    Collapse,
    List,
    ListItemAvatar,
    Divider,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput
} from "@material-ui/core";
import {serverUrl} from "../../../utils/config";
import {Add, Delete, Close, MoreVertOutlined, ExpandLess, ExpandMore} from "@material-ui/icons";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import {useDrawerStyles} from "../../../src/material-styles/drawerStyles";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {addMemberToCommitteeAPI, fetchNotInCommitteeMembersAPI} from "../../../utils/apiCalls/users";
import CircularLoading from "../../loading/CircularLoading";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";

const RenderCommitteeDepartmentsComponent = ({members,department,committeeType}) => {
    const tableClasses = useTableStyles();
    const avatarClasses = useDrawerStyles();
    const emptyStyles = useListItemStyles();
    const classes = useListContainerStyles();
    const [newMembers,setNewMembers] = useState([]);
    const [usersList,setUsersList] = useState([]);
    const [filter,setFilter] = useState(members.filter(member => member.ugpc_details.committees.includes(department)));
    const [openList,setOpenList] = useState(false);
    const [position,setPosition] = useState('Member');
    const [selectedIndex,setSelectedIndex]=useState();
    const [error,setError] = useState({
        emptyUser:false,
        response:false
    });
    const [dialog,setDialog] = useState({
        addMember:false,
        removeDep:false,
        removeCom:false
    });
    const [loading,setLoading] = useState({
        addMember:false,
        removeDep:false,
        removeCom:false,
        newMembers:true
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const handleListItemClick = index=>{
        setError({
            emptyUser: false
        });
        setSelectedIndex(index);
    };
    const removeFromDepartment = (userId,committees)=>{
        if(committees.length === 1){
            removeFromCommittee(userId)
        }else {
            console.log(userId);
            console.log(committees)
        }

    };
    const removeFromCommittee = userId =>{
        console.log(userId);
    };
    const handleClickAddMember = ()=>{
        fetchNotInCommitteeMembersAPI()
            .then(result =>{
                setLoading({
                    ...loading,
                    newMembers: false
                });
                const otherMembers = members.filter(member => !member.ugpc_details.committees.includes(department) && member.ugpc_details.position === 'Member');
                setNewMembers(result);
                setUsersList([...result,...otherMembers]);
            })
            .catch(err =>{
                console.log(err.message)
            });
        setDialog({...dialog, addMember:true})
    };

    const handleChangePosition = event =>{
        setPosition(event.target.value);
        const otherMembers = members.filter(member => !member.ugpc_details.committees.includes(department) && member.ugpc_details.position === event.target.value);
        setUsersList([...newMembers,...otherMembers]);
        console.log(otherMembers);
    };
    const handleAddMember = ()=>{
        if(selectedIndex === undefined){
            setError({
                emptyUser: true
            });
            return
        }
        const data = {
            userId:usersList[selectedIndex]._id,
            committeeType,
            department,
            position
        }
        console.log(data);
        addMemberToCommitteeAPI(data)
            .then(result =>{
                if (result.error){
                    console.log(result.error)
                }
            })
    }
    return (
        <div>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
                <Button startIcon={<Add/>} color='primary' onClick={handleClickAddMember}>Add Member</Button>
            </div>

            {
                filter.length === 0 ?
                    <div className={emptyStyles.emptyListContainer} >
                        <div className={emptyStyles.emptyList}>
                            No Member Found
                        </div>
                    </div>:

                    <div className={tableClasses.tableWrapper}>

                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left"></TableCell>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Position</TableCell>
                                    <TableCell align="left">Designation</TableCell>
                                    <TableCell align="left">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {
                                    filter.map((member,index) => (

                                        <TableRow key={index} className={tableClasses.tableRow} >
                                            <TableCell align="left">
                                                {
                                                    member.profileImage && member.profileImage.filename ?
                                                        <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${member.profileImage.filename }`}  />
                                                        :
                                                        <Avatar className={avatarClasses.avatarColor}>
                                                            { member.name.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                }
                                            </TableCell>
                                            <TableCell align="left">{member.name}</TableCell>
                                            <TableCell >{member.email}</TableCell>
                                            <TableCell >
                                                <Chip
                                                    label={member.ugpc_details.position}
                                                />
                                            </TableCell>
                                            <TableCell align="left">{member.ugpc_details.designation ? member.ugpc_details.designation : 'Not Provided'}</TableCell>
                                            <TableCell align="left">
                                                <Tooltip title='more' placement='top'>
                                                    <IconButton size='small' onClick={(event)=>setAnchorEl(event.currentTarget)}>
                                                        <MoreVertOutlined/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={()=>setAnchorEl(null)}
                                                >

                                                    <MenuItem onClick={()=>removeFromDepartment(member._id,member.ugpc_details.committees)}>
                                                        <ListItemIcon>
                                                            <Delete color='error'/>
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Remove From Department only
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={()=>removeFromCommittee(member._id)}>
                                                        <ListItemIcon>
                                                            <Delete color='error'/>
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Remove From Committee
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={()=>setAnchorEl(null)}>
                                                        <ListItemIcon>
                                                            <Close />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit" noWrap>
                                                            Cancel
                                                        </Typography>
                                                    </MenuItem>

                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
            }
            <Dialog open={dialog.addMember} onClose={()=>setDialog({...dialog,addMember: false})} fullWidth maxWidth='sm'>
                {loading.addMember && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Add Member</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=> setDialog({...dialog, addMember:false})}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl variant="outlined" fullWidth margin='dense' style={{minWidth:160}}>
                        <InputLabel htmlFor="position">
                            Position
                        </InputLabel>
                        <Select
                            value={position}
                            onChange={handleChangePosition}
                            input={<OutlinedInput labelWidth={60} name="position" id="position" />}
                        >
                            <MenuItem value='Member'>Member</MenuItem>
                            <MenuItem value='Chairman_Committee'>Chairman</MenuItem>
                            {
                                committeeType === 'Defence' &&
                                <MenuItem value='Coordinator'>Coordinator</MenuItem>
                            }
                        </Select>
                    </FormControl>
                    <List >
                        <ListItem button onClick={()=>setOpenList(!openList)}>
                            <ListItemText primary="Select Member" />
                            {openList ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openList} timeout="auto" unmountOnExit>
                            {loading.newMembers ? <CircularLoading/> :
                                <List component="div" disablePadding className={classes.root}>
                                    {
                                        usersList.length === 0 ?
                                            <ListItem>
                                                <Typography variant='h5' style={{textAlign:"center"}}>No Member Found</Typography>
                                            </ListItem>
                                            :
                                            usersList.map((member,index)=>(
                                                <Fragment key={index}>
                                                    <ListItem
                                                      alignItems='flex-start'
                                                      selected={selectedIndex === index}
                                                      onClick={()=>handleListItemClick(index)}
                                                      className={emptyStyles.listItemHoverColor}
                                                    >
                                                        <ListItemAvatar>
                                                            {
                                                                member.profileImage && member.profileImage.filename ?
                                                                    <Avatar  className={avatarClasses.imageAvatar}  src={`${serverUrl}/../static/images/${member.profileImage.filename }`}  />
                                                                    :
                                                                    <Avatar className={avatarClasses.avatarColor}>
                                                                        { member.name.charAt(0).toUpperCase()}
                                                                    </Avatar>
                                                            }
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            style={{flexGrow:1}}
                                                            primary={member.name}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        display='block'
                                                                        variant="overline"
                                                                        color="textPrimary"
                                                                    >
                                                                        {member.ugpc_details.designation}
                                                                    </Typography>
                                                                    {` — ${member.email}`}
                                                                </React.Fragment>
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant='body2'>Departments</Typography>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    variant="caption"
                                                                    color="textSecondary"
                                                                >
                                                                    {
                                                                        member.ugpc_details.committees.length === 0 || member.ugpc_details.committees[0] === null ? 'None' :
                                                                            member.ugpc_details.committees.map((dep,i) => `${i>1?',':''}${dep}`)
                                                                    }
                                                                </Typography>

                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" />
                                                </Fragment>
                                            ))}

                                </List>
                            }

                        </Collapse>
                    </List>
                    {error.emptyUser && <Typography variant='caption' color='error' >Please select Member</Typography> }
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setDialog({...dialog, addMember:false})}>Cancel</Button>
                    <Button color='primary' onClick={handleAddMember}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RenderCommitteeDepartmentsComponent;