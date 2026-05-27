import React, {useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {Box, Divider, ListItem, ListItemButton, ListItemText, Typography,Grid,Paper,List} from "@mui/material";

import CategoryManager from "./CategoryManager.jsx";

import UserManager from "./UserManager.jsx";

const CommunityAdminDashboard = () => {

    const {urlPath} = useParams();
    const [activeMenu, setActiveMenu] = useState('category');
    const {state} = useLocation();
    const boardName = state?.boardName;



    const renderContent = () => {
        switch (activeMenu) {
            case 'CATEGORY':
                return <Typography variant="h6">
                    <CategoryManager urlPath={urlPath} />
                </Typography>;
            case 'COMMENT':
                return <Typography variant="h6"> 댓글 관리 (준비 중)</Typography>;
            // return <CommentManager urlPath={urlPath} />;
            case 'USER':
                return <Typography variant="h6">
                   <UserManager urlPath={urlPath} />
                </Typography>;
            case 'POST':
                return <Typography variant="h6"> 게시글 고정 관리 (준비 중)</Typography>;
            // return <PostManager urlPath={urlPath} />;
            default :
                return <Typography variant="h6"> 카테고리 관리 (준비 중)</Typography>;
        }
    }


    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* 사이드바 영역: 12컬럼 중 3점유 */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>

                        {/* 관리자 페이지 헤더 역할 */}
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Typography variant="subtitle1" fontWeight="bold">커뮤니티 관리</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {boardName || urlPath}
                            </Typography>
                        </Box>
                        <Divider />

                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('CATEGORY')} selected={activeMenu === 'CATEGORY'}>
                                    <ListItemText primary="카테고리 관리" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('COMMENT')} selected={activeMenu === 'COMMENT'}>
                                    <ListItemText primary="댓글 관리" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('USER')} selected={activeMenu === 'USER'}>
                                    <ListItemText primary="유저 관리" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('POST')} selected={activeMenu === 'POST'}>
                                    <ListItemText primary="게시글 관리" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* 컨텐츠 영역: 12컬럼 중 9점유 */}
                <Grid item xs={12} md={9}>
                    <Box>
                        {renderContent()}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CommunityAdminDashboard;