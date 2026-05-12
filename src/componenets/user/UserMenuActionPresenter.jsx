import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useAuth} from "../../context/AuthContext.jsx";
import {isAdmin, isSuperAdmin} from "../util/roleUtils.js";

const UserMenuActionPresenter = ({anchorElement, // 화면상 클릭한 x,y위치를 반환
                        onOpenMenu,
                        onCloseMenu,
                        onGrantAdmin}) => {

    // anchorElement가 있을 때만 open
    const isOpen = Boolean(anchorElement);

    const { role } = useAuth();

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
                {isSuperAdmin(role) && (
                    <MenuItem onClick={() => { onGrantAdmin(); onCloseMenu(); }}>
                        커뮤니티 관리자 부여
                    </MenuItem>
                )}
                {isAdmin(role) && (
                    <MenuItem onClick={onCloseMenu} disabled>
                        (예정) 유저 밴 / 차단
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default UserMenuActionPresenter;