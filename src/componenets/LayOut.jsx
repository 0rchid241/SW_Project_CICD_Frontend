import React from 'react';
import {Outlet,useNavigate} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';

const LayOut = () => {

    const navigate = useNavigate();

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