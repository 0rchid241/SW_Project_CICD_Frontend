import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useAuth} from "../../context/AuthContext.jsx";
import {isAdmin, isSuperAdmin} from "../util/roleUtils.js";

const PostMenuActionPresenter = ({anchorElement,
                                    onOpenMenu,
                                    onCloseMenu,
                                    onPinPost}) => {

    const isOpen = Boolean(anchorElement);
    const {role} = useAuth();

    return (
        <>
            <IconButton onClick={onOpenMenu} size="small">
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorElement}
                open={isOpen}
                onClose={onCloseMenu}
            >
                {isAdmin(role) && (
                    <MenuItem onClick={() => {onPinPost(); onCloseMenu();}}>
                        글 상단 고정/해제
                    </MenuItem>
                )}
            </Menu>
        </>
    )
};

export default PostMenuActionPresenter;