import React, {useState} from 'react';
import {
    Box,
    Paper,
    ListItemText,
    Divider,
    ListItemButton,
    ListItem, Grid,
    List
} from '@mui/material';

import UserInfo from "./UserInfo.jsx";
import MyPosts from "./MyPosts.jsx";
import MyCommentsContainer from "./MyCommentsContainer.jsx";

const MyPage = () => {

 /*
    커스텀훅으로 이동시킬 녀석들
    const navigate = useNavigate();
    const{isLoggedIn,token,username,nickname} = useContext(AuthContext);
*/


    const [activeMenu, setActiveMenu] = useState(`INFO`);

    const renderContent = () => {
        switch (activeMenu) {
            case 'INFO': return <UserInfo/>;
            case 'POSTS': return <MyPosts/>;
            case 'COMMENTS': return <MyCommentsContainer/>;
            case 'SETTINGS': return <Box>환경설정 (준비 중)</Box>;
            default : return <UserInfo/>
        }
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* 사이드바 영역: 12컬럼 중 3점유 */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('INFO')} selected={activeMenu === 'INFO'}>
                                    <ListItemText primary="내 정보" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('POSTS')} selected={activeMenu === 'POSTS'}>
                                    <ListItemText primary="내가 쓴 글" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('COMMENTS')} selected={activeMenu === 'COMMENTS'}>
                                    <ListItemText primary="내가 쓴 댓글" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setActiveMenu('SETTINGS')} selected={activeMenu === 'SETTINGS'}>
                                    <ListItemText primary="환경설정" />
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

export default MyPage;