import React, {useState} from 'react';
import useNotifications from "../hooks/useNotifications.js";
import {Box, Divider, IconButton, MenuItem, Typography, Badge,Menu} from "@mui/material";
import {useNavigate} from "react-router-dom";

const NotificationBadge = () => {

    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = (e) =>{
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleNotificationClick = (noti) =>{
        if (!noti.isRead) {
            markAsRead(noti.id);
        }
        // 해당 게시글로 이동
        navigate(noti.url);
        handleClose();
    }


    return (
        <Box>
            {/* 알림 종 아이콘 */}
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    🔔
                </Badge>
            </IconButton>

            {/* 알림 드롭다운 메뉴 */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { maxHeight: 400, width: '300px' },
                }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">알림</Typography>
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                            새로운 알림이 없습니다.
                        </Typography>
                    </MenuItem>
                ) : (
                    notifications.map((noti) => (
                        <MenuItem
                            key={noti.id}
                            onClick={() => handleNotificationClick(noti)}
                            sx={{
                                // 안 읽은 알림은 배경색을 살짝 다르게 주어 시각적 구분 (UX 개선)
                                backgroundColor: noti.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                whiteSpace: 'normal', // 긴 텍스트 줄바꿈 허용
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: noti.isRead ? 'normal' : 'bold' }}>
                                {noti.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(noti.createdAt).toLocaleString()}
                            </Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </Box>
    );
};

export default NotificationBadge;