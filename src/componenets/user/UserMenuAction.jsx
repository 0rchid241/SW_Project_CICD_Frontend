import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from "../../context/AuthContext.jsx";
import { isAdmin, isSuperAdmin } from "../util/roleUtils.js";
import ErrorMessage from "../util/ErrorMessage.jsx";
import useUserAdminAction from "../../hooks/useUserAdminAction.js";


const UserMenuAction = ({ targetUserId }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { role } = useAuth();

    // 훅을 통해 비즈니스 로직 함수들을 가져옴
    const { handleGrantAdmin, warnUser } = useUserAdminAction({ targetUserId });

    const handleOpenMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    /* 어드민 권한 부여 */
    const onGrantAdminClick = async () => {
        try {
            await handleGrantAdmin(); // 비즈니스 로직 실행
            alert("성공적으로 Community Admin 권한이 부여됐습니다."); // UI 피드백
            handleCloseMenu();
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    /* 유저 경고 핸들러 */
    const onWarnUserClick = async () => {
        try {
            await warnUser(); // 비즈니스 로직 실행 (내부에서 prompt 호출)

            alert("관리자 작업이 완료되었습니다.");
            handleCloseMenu();
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    return (
        <>
            <ErrorMessage errorMessage={errorMessage} />

            <IconButton onClick={handleOpenMenu} size="small">
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                {/* 권한에 따른 메뉴 렌더링 */}
                {isSuperAdmin(role) && (
                    <MenuItem onClick={onGrantAdminClick}>
                        커뮤니티 관리자 부여
                    </MenuItem>
                )}

                {isAdmin(role) && (
                    <MenuItem onClick={onWarnUserClick}>
                        유저 경고 및 제재
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default UserMenuAction;