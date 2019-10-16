import React from 'react';
import {IconButton, Menu, Tooltip} from "@material-ui/core";
import {Add} from "@material-ui/icons";

const AddMenu = ({addMenuContent}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    return (
        <div>
            <Tooltip title='Add' placement='right'>
                <IconButton onClick={event => setAnchorEl(event.currentTarget)} size='small'>
                    <Add/>
                </IconButton>
            </Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>setAnchorEl(null)}
            >
                {addMenuContent}
            </Menu>
        </div>
    );
};

export default AddMenu;