import React, {useEffect, useState} from 'react';
import {Outlet,useNavigate} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Button, Stack } from '@mui/material';

const LayOut = () => {

    const navigate = useNavigate();
    // 처음 로그인 상태 확인 / localStorage에 accessToken이 있다면 true
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem("accessToken");
    });
    const [nickname, setNickname] = useState(() => {
        return localStorage.getItem("nickname");
    })

    // 로그인 상태가 바뀌었다는 신호가 오면 localStorage를 다시 확인해서 상단 버튼 변경
    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("accessToken");
            const savedNickname = localStorage.getItem("nickname");

            setIsLoggedIn(!!token);
            setNickname(savedNickname);
        };

        window.addEventListener("auth-change", handleAuthChange);
        // storage 이벤트는 다른 탭에서 localStorage가 변경되었을 때 감지하는 이벤트
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    // 로그아웃 시 저장된 jwt 삭제 -> 로그인 상태 변경 이벤트 발생 -> 메인 이동
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("nickname");

        window.dispatchEvent(new Event("auth-change"));
        navigate("/");
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* 공통 상단 네비게이션 바 (Header) */}
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Toolbar>
                    {/* 로고 역할: 클릭 시 메인('/')으로 이동 */}
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
                                    <Button variant="outlined" color="error" onClick={handleLogout}>
                                        로그아웃
                                    </Button>
                                </>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* 공통 메인 콘텐츠 영역
              maxWidth="lg": 최대 너비를 제한하여 너무 넓게 퍼지는 것을 방지
              sx={{ mt: 5, mb: 5 }}: 상하 마진을 주어 깔끔하게 띄움
            */}
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
                {/* 하위 라우트로 지정된 컴포넌트들이 Outlet 위치에 렌더링됩니다. */}
                <Outlet />
            </Container>
        </Box>
    );
};

export default LayOut;