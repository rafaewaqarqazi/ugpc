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
    OutlinedInput, DialogContentText
} from "@material-ui/core";
import {serverUrl} from "../../../utils/config";
import {Add, Delete, Close, MoreVertOutlined, ExpandLess, ExpandMore} from "@material-ui/icons";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import {useDrawerStyles} from "../../../src/material-styles/drawerStyles";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {
    addMemberToCommitteeAPI,
    fetchNotInCommitteeMembersAPI, removeFromCommitteeAPI,
    removeFromCommitteeDepartmentAPI
} from "../../../utils/apiCalls/users";
import CircularLoading from "../../loading/CircularLoading";
import {useListContainerStyles} from "../../../src/material-styles/listContainerStyles";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import {useDialogStyles} from "../../../src/material-styles/dialogStyles";

const RenderCommitteeDepartmentsComponent = ({members = {id: '', members: []},department,committeeType,setSuccess}) => {
    const tableClasses = useTableStyles();
    const avatarClasses = useDrawerStyles();
    const emptyStyles = useListItemStyles();
    const classes = useListContainerStyles();
    const dialogClasses = useDialogStyles();
    const [newMembers,setNewMembers] = useState([]);
    const [usersList,setUsersList] = useState([]);
    const [filter,setFilter] = useState(members && members.members ? members.members.filter(member => member.ugpc_details.committees.includes(department)) : []);
    const [openList,setOpenList] = useState(false);
    const [position,setPosition] = useState('Member');
    const [selectedIndex,setSelectedIndex]=useState();
    const [removeData,setRemoveData] = useState({
        userId:'',
        committees:[],
        removeType:''
    });


    const [error,setError] = useState({
        emptyUser:false,
        addMember:{
            show:false,
            message:''
        },
        remove:{
            show:false,
            message:''
        },
        response:{
            show:false,
            message:''
        }
    });
    const [dialog,setDialog] = useState({
        addMember:false,
        removeMember:false
    });
    const [loading,setLoading] = useState({
        addMember:false,
        remove:false,
        newMembers:true
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const handleListItemClick = index=>{
        setError({
            ...error,
            emptyUser: false
        });
        setSelectedIndex(index);
    };
    const removeRes = result =>{
        if (result.error){
            setLoading({
                ...loading,
                remove:false
            });
            setError({...error,remove: {show:true,message:result.error}});
            return;
        }
        setLoading({
            ...loading,
            remove:false
        });
        setDialog({...dialog,removeMember:false});
        setSuccess({show:true,message:result.message});

    };
    const handleClickRemoveMember = (removeType)=>{
        setRemoveData({
            ...removeData,
            removeType
        });
        setDialog({
            ...dialog,
            removeMember:true
        });
    };
    const handleClickActionMenu = (userId,committees,event)=>{
        setRemoveData({
            ...removeData,
            userId,
            committees
        });
        setAnchorEl(event.currentTarget);
    };
    const handleClickAddMember = ()=>{
        setLoading({
            ...loading,
            newMembers: true
        });
        fetchNotInCommitteeMembersAPI()
            .then(result =>{
                setLoading({
                    ...loading,
                    newMembers: false
                });
                const otherMembers = members.members.filter(member => !member.ugpc_details.committees.includes(department) && member.ugpc_details.position === 'Member');
                setNewMembers(result);
                setUsersList([...result,...otherMembers]);
            })
            .catch(err =>{
                setError({...error,addMember: {show:true,message:err.message}});
            });
        setDialog({...dialog, addMember:true})
    };

    const handleChangePosition = event =>{
        setPosition(event.target.value);
        const otherMembers = members.members.filter(member => !member.ugpc_details.committees.includes(department) && member.ugpc_details.position === event.target.value);
        setUsersList([...newMembers,...otherMembers]);
    };
    const handleAddMember = ()=>{
        if(selectedIndex === undefined){
            setError({
                ...error,
                emptyUser: true
            });
            return
        }
        setLoading({
            ...loading,
            addMember:true
        });
        const data = {
            userId:usersList[selectedIndex]._id,
            committeeType,
            department,
            position
        };
        addMemberToCommitteeAPI(data)
            .then(result =>{

                if (result.error){
                    setLoading({
                        ...loading,
                        addMember:false
                    });
                    setError({...error,addMember: {show:true,message:result.error}});
                    return;
                }
                setLoading({
                    ...loading,
                    addMember:false
                });
                setDialog({
                    ...dialog,
                    addMember:false
                });
                setSuccess({show:true,message:result.message});
            })
            .catch(error1 => {
                setError({...error,response: {show:true,message:error1.message}});
            })
    };
    const handleRemoveMember = ()=>{
        setLoading({
            ...loading,
            remove:true
        });
        if(removeData.committees.length === 1 || removeData.removeType === 'Committee'){
            removeFromCommitteeAPI({userId:removeData.userId})
                .then(removeRes)
                .catch(error1 => {
                    setError({...error,remove: {show:true,message:error1.message}});
                });
        }else {
            removeFromCommitteeDepartmentAPI({userId:removeData.userId,department})
                .then(removeRes)
                .catch(error1 => {
                    setError({...error,remove: {show:true,message:error1.message}});
                })
        }
    };

    return (
        <div>

            <div style={{display:'flex',justifyContent:'flex-end'}}>
                <Button startIcon={<Add/>} color='primary' onClick={handleClickAddMember}>Add Member</Button>
            </div>
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
                            filter.length === 0 ?
                                <TableRow >
                                    <TableCell colSpan={6}>
                                        <div className={emptyStyles.emptyListContainer} >
                                            <div className={emptyStyles.emptyList}>
                                                No Member Found
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>:
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
                                            <IconButton size='small' onClick={(event)=>handleClickActionMenu(member._id,member.ugpc_details.committees,event)}>
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

                                            <MenuItem onClick={()=>handleClickRemoveMember('Department')}>
                                                <ListItemIcon>
                                                    <Delete color='error'/>
                                                </ListItemIcon>
                                                <Typography variant="inherit" noWrap>
                                                    Remove From Department only
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={()=>handleClickRemoveMember('Committee')}>
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

            <Dialog open={dialog.addMember} onClose={()=>setDialog({...dialog,addMember: false})} fullWidth maxWidth='sm' classes={{root: dialogClasses.root}}>
                {loading.addMember && <LinearProgress/>}

                <ErrorSnackBar open={error.addMember.show} message={error.addMember.message} handleSnackBar={()=>setError({...error,addMember: {show:false,message:''}})}/>
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
                                                                        member.ugpc_details.committees.length === 0 || (member.ugpc_details.committees.length === 1 && member.ugpc_details.committees[0] === null)? 'None' :
                                                                            member.ugpc_details.committees.map((dep,index) => dep != null && `${ index > 1? ',':''}${dep}`)
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
            <Dialog open={dialog.removeMember} onClose={()=>setDialog({...dialog,removeMember: false})} fullWidth maxWidth='xs' classes={{paper: dialogClasses.root}}>
                {loading.remove && <LinearProgress/>}
                <ErrorSnackBar open={error.remove.show} message={error.remove.message} handleSnackBar={()=>setError({...error,remove: {show:false,message:''}})}/>

                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Remove Member</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=> setDialog({...dialog, removeMember:false})}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>Are You sure you want to Remove?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setDialog({...dialog, removeMember:false})}>Cancel</Button>
                    <Button color='primary' onClick={handleRemoveMember}>Remove</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RenderCommitteeDepartmentsComponent;