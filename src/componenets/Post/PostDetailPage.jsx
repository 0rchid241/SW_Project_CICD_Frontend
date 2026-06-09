import React, {useContext, useEffect, useState} from 'react';
import {data, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Divider, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import CommentList from "../Comment/CommentList.jsx";
import CommentSection from "../Comment/CommentSection.jsx";
import PostLikeButton from "./PostLikeButton.jsx";

import {AuthContext} from "../../context/AuthContext.jsx";
import {apiFetch} from "../util/apiFetch.js";
import PostMenu from "./PostMenu.jsx";
import PostActionButton from "./PostActionButton.jsx";

const PostDetailPage = () => {

    const {postId} = useParams();
    const {urlPath} = useParams();
    const [postData, setPostData] = useState(null)

    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        console.log("현재 상세페이지 게시글 ID:", postId);

        const getPost = async () => {
            try {
                const response = await apiFetch(`/api/community/board/${urlPath}/post/${postId}`)
                const data = await response.json();
                setPostData(data);
            } catch (error) {
                console.error("API 호출 중 에러 발생:", error.message);
            }
        };
        getPost();

    }, [postId]);


    
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
                    <Typography color="text.secondary">조회 {postData.viewCount ?? 0}</Typography>
                    <PostMenu postId={postId} />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                    {postData.content}
                </Typography>

                {/* 추천수 버튼 */}
                <PostLikeButton
                    urlPath={urlPath}
                    postId={postId}
                    initialLikeCount={postData.likeCount}
                />
                <Divider sx={{ my: 2 }} />

                {/* 수정/삭제 버튼 */}
                <PostActionButton postId={postId} urlPath={urlPath} isLoggedIn={isLoggedIn} authorUserId={postData.userId}></PostActionButton>

                {/* 댓글 컴포넌트*/}
                <CommentSection urlPath = {urlPath} postId={postId}></CommentSection>


            </Paper>
        </Box>
    );
};

export default PostDetailPage;