import React, {useEffect, useState} from 'react';
import {data, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Divider, Paper, Stack, TextField, Typography} from "@mui/material";
import CommentList from "../Comment/CommentList.jsx";
import CommentContainer from "../Comment/CommentContainer.jsx";
import PostLikeButton from "./PostLikeButton.jsx";
import DeleteAction from "./delete/DeleteAction.jsx";

const PostDetailPage = () => {

    const {id} = useParams();
    const {urlPath} = useParams();

    const [postData, setPostData] = useState(null)
    const [password, setPassword] = useState("")
    const [showDelete, setShowDelete] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        console.log("현재 상세페이지 게시글 ID:", id);

        /* 토큰을 찾아서 로그인 한지 안한지 체크 */
        const token = localStorage.getItem('accessToken');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoggedIn(!!token);


        const getPost = async () => {
            try {
                const response = await fetch(`/api/community/board/${urlPath}/post/${id}`)
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

                {/* 본 글 내용 */}
                <Typography variant="h4" gutterBottom>{postData.title}</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, color: 'text.secondary' }}>
                    <Typography>작성자: {postData.authorName}</Typography>
                    <Typography>작성일: {postData.createAt}</Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                    {postData.content}
                </Typography>

                {/* 추천수 버튼 */}
                <PostLikeButton
                    urlPath={urlPath}
                    postId={id}
                    initialLikeCount={postData.likeCount}
                />
                <Divider sx={{ my: 2 }} />

                {/* 댓글 컴포넌트*/}
                <CommentContainer urlPath = {urlPath} postId={id}></CommentContainer>


                {/* 삭제 컴포넌트 */}
                <DeleteAction
                    urlPath={urlPath}
                    postId={id}
                    isLoggedIn={isLoggedIn}
                    token={localStorage.getItem('accessToken')}
                />


            </Paper>
        </Box>
    );
};

export default PostDetailPage;