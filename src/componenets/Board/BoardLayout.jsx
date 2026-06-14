import React from 'react';
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useBoardNav} from "../../hooks/useBoardNav.js";
import {Box, Divider, Typography} from "@mui/material";
import LoadingCircle from "../util/LoadingCircle.jsx";

const BoardLayout = () => {

    const {urlPath} = useParams();
    const navigate = useNavigate();


    const {navInfo, loading} = useBoardNav(urlPath);




    if (loading) return <LoadingCircle/>;
    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
            {/* 🌟 공통 네비게이션 영역 (항상 유지됨) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                 onClick={() => navigate(`/board/${urlPath}`)}>
                <Typography variant="h4" fontWeight="bold">
                    {navInfo?.name || "로딩 중..."}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 알맹이가 렌더링 되는 곳 (BoardPage, PostDetailPage 등이 여기에 들어옴) */}
            <Outlet />

        </Box>
    );
};

export default BoardLayout;