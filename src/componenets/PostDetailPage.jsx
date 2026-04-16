import React, {useEffect, useState} from 'react';
import {data, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Divider, Paper, Stack, TextField, Typography} from "@mui/material";

const PostDetailPage = () => {

    const {id} = useParams();
    const [postData, setPostData] = useState(null)
    const [password, setPassword] = useState("")
    const [showDelete, setShowDelete] = useState(false)
    const navigate = useNavigate();


    const handleDelete = async () =>{
        const response = await fetch(`http://localhost:8080/community/post/${id}/delete`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password:password})
        });

        if(response.ok){
            alert("삭제완료")
            navigate("/")
        }else {
            alert("비밀번호가 틀렸습니다.");
        }

    }

    useEffect(() => {
        console.log("현재 상세페이지 ID:", id);

        const getPost = async () => {
            try {
                const response = await fetch(`http://localhost:8080/community/post/${id}`);
                const data = await response.json();
                setPostData(data);
            } catch (error) {
                console.error("API 호출 중 에러 발생:", error);
            }
        };
        getPost();

    }, [id]);

    if (!postData) {
        return <div style={{ color: 'white' }}>데이터 로딩 중...</div>;
    }

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>{postData.title}</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, color: 'text.secondary' }}>
                    <Typography>작성자: {postData.authorName}</Typography>
                    <Typography>작성일: {postData.createAt}</Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                    {postData.content}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/')}>목록으로</Button>
                    <Button variant="contained" color="error" onClick={() => setShowDelete(!showDelete)}>
                        삭제하기
                    </Button>
                </Stack>

                {/* 삭제 버튼 클릭 시 나타나는 비밀번호 입력창 */}
                {showDelete && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                label="비밀번호"
                                type="password"
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                확인
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PostDetailPage;