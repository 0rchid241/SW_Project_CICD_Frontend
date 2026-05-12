import React, {useContext} from 'react';
import {Outlet,useNavigate} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Button, Stack } from '@mui/material';
import {AuthContext} from "../../context/AuthContext.jsx";
import NotificationBadge from "../NotificationBadge.jsx";

const LayOut = () => {

    const navigate = useNavigate();


    /* 일일이 컴포넌트에서 상태를 뽑아내지 말고 전역 Context에서 뽑아오기 */
    const { isLoggedIn, nickname, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => navigate('/')}
                    >
                        😎커뮤니티 이름 뭐로할까요~?😙
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Stack direction="row" spacing={1} alignItems="center">
                        {!isLoggedIn ? (
                            <>
                                <Button color="inherit" onClick={() => navigate('/signup')}>
                                    회원가입
                                </Button>
                                <Button variant="contained" onClick={() => navigate('/login')}>
                                    로그인
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => navigate('/me')}>
                                    {nickname || "내 정보"}
                                </Button>
                                <Button onClick={()=>navigate('/admin/superAdminPage')}>
                                    관리자 페이지
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleLogout}>
                                    로그아웃
                                </Button>

                                <NotificationBadge/>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default LayOut;