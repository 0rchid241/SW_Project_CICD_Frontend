import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, Stack, TextField, Typography} from "@mui/material";

const CommentInputForm = ({onSubmit}) => {


    const [commentData, setCommentData] = useState({
        authorName: "",
        password:"",
        content: ""
    })

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoggedIn(true);
        }
    }, []);


    const handleCreateComment = async ()=>{

        if(
            !isLoggedIn &&
            !commentData.authorName || !commentData.content || !commentData.password){
            alert("이름, 내용, 비밀번호를 모두 입력하세요");
            return;
        }

        /* 인자로 받은 댓글작성핸들러 실행 */
        const response = await onSubmit(commentData);

        /* 댓글 입력 초기화 */
        if (response && response.ok) {
            setCommentData({
                authorName: "",
                password: "",
                content: ""
            });
        }else {
            alert("댓글 작성에 실패했습니다.");
        }
    }




    return (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            {!isLoggedIn && (
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        label="이름"
                        size="small"
                        value={commentData.authorName}
                        onChange={(e) => setCommentData({ ...commentData, authorName: e.target.value })}
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        size="small"
                        value={commentData.password}
                        onChange={(e) => setCommentData({ ...commentData, password: e.target.value })}
                    />
                </Stack>
            )}

            <TextField
                label="댓글을 남겨보세요"
                multiline
                rows={3}
                fullWidth
                value={commentData.content}
                onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleCreateComment}>
                    등록
                </Button>
            </Box>
        </Box>
    );
};

export default CommentInputForm;