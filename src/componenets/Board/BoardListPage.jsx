import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Card, CardActionArea, CardContent, Container, Grid, Typography} from "@mui/material";
import PopularPostPreview from "./PopularPostPreview.jsx";

const BoardListPage = () => {

    const [boardsData, setBoardsData] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBoards = async () =>{
            try {
                const response = await fetch("/api/community/board/getAllBoards");
                const data = await response.json();
                setBoardsData(data);
            }catch (e){
                console.log(`커뮤니티 목록 불러오던 중 오류발생 ${e}`)
            }
        }
        fetchBoards();
    }, []);

    return (
        <Container >
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                커뮤니티 목록
            </Typography>

            <PopularPostPreview/>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                관심 있는 갤러리를 선택하여 게시글을 확인해보세요.
            </Typography>

            <Grid container spacing={3}>
                {boardsData.map((board) => (
                    // 화면 크기에 따른 반응형 레이아웃 설정 (xs: 모바일, sm: 태블릿, md: 데스크탑)
                    <Grid item xs={12} sm={6} md={4} key={board.id}>
                        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* CardActionArea: 카드 전체를 클릭 가능하게 만들고 물결 효과(Ripple)를 줍니다. */}
                            <CardActionArea
                                onClick={() => navigate(`/board/${board.urlPath}`)}
                                sx={{ flexGrow: 1 }}
                            >
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                                        {board.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {board.description || '게시판 설명이 없습니다.'}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default BoardListPage;