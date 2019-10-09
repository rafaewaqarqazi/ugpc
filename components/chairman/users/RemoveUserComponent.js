import React, {useContext, useState} from 'react';
import {
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
    Tooltip,
    Typography,
    Zoom,
    Button
} from "@material-ui/core";
import {Close, Delete} from "@material-ui/icons";
import ErrorSnackBar from "../../snakbars/ErrorSnackBar";
import UserContext from "../../../context/user/user-context";
const RemoveUserComponent = ({userId,type,setSuccess}) => {
    const userContext = useContext(UserContext);
    const [confirm,setConfirm] = useState(false);
    const [loading,setLoading] = useState(false);

    const [error,setError] = useState(false);
    const handleClickRemoveUser = ()=>{
        setLoading(true);
        userContext.removeUser(userId,type)
            .then(result =>{
                setConfirm(false);
                if (result.error){
                    setLoading(false);
                    setError(true);
                    return
                }
                setLoading(false);
                setSuccess(true);
            })
    };
    return (
        <div>

            <ErrorSnackBar open={error} message="Couldn't Remove User!" handleSnackBar={()=>setError(false)}/>
            <Tooltip  title='Remove User' placement="top" TransitionComponent={Zoom}>
                <IconButton edge="end" aria-label="delete" onClick={()=>setConfirm(true)} size='small'>
                    <Delete color='error'/>
                </IconButton>
            </Tooltip>
            <Dialog open={confirm} onClose={()=>setConfirm(false)} fullWidth maxWidth='xs'>
                {loading && <LinearProgress/>}
                <DialogTitle style={{display:'flex', flexDirection:'row'}} disableTypography>
                    <Typography variant='h6' noWrap style={{flexGrow:1}}>Confirm</Typography>
                    <Tooltip  title='Close' placement="top" TransitionComponent={Zoom}>
                        <IconButton size='small' onClick={()=>setConfirm(false)}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>Are you sure?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setConfirm(false)}>Cancel</Button>
                    <Button color='primary' onClick={handleClickRemoveUser}>Remove</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RemoveUserComponent;