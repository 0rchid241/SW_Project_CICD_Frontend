import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext.jsx";
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    List, ListItem, ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {apiFetch} from "../../util/apiFetch.js";
import BoardCreateManager from "./BoardCreateManager.jsx";
import {useNavigate} from "react-router-dom";
import AdminUserManager from "./AdminUserManager.jsx";

const SuperAdminDashboard = () => {

    const [activeMenu, setActiveMenu] = useState('CREATE_BOARD');

    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeMenu) {
            case 'CREATE_BOARD':
                return <BoardCreateManager />;
            case 'MANAGE_ADMIN':
                return <Typography variant="h6">
                    <AdminUserManager/>
                </Typography>;
            default:
                return <BoardCreateManager />;
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* 사이드바 영역: 12컬럼 중 3점유 */}
                <Grid item xs={12} md={2}>
                    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Typography variant="subtitle1" fontWeight="bold">⚙ SUPER_ADMIN 대시보드 </Typography>
                        </Box>
                        <Divider />

                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('CREATE_BOARD')} selected={activeMenu === 'CREATE_BOARD'}>
                                    <ListItemText primary="커뮤니티 생성" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('MANAGE_ADMIN')} selected={activeMenu === 'MANAGE_ADMIN'}>
                                    <ListItemText primary="게시판 어드민 관리" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => navigate('/ops')}>
                                    <ListItemText primary="운영 페이지로 이동" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* 컨텐츠 영역: 12컬럼 중 9점유 */}
                <Grid item xs={12} md={10}>
                    <Box>
                        {renderContent()}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SuperAdminDashboard;