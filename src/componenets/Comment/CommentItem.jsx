import React, {useContext, useState} from 'react';
import {Box, Button, Divider, Stack, TextField, Typography} from "@mui/material";
import CommentInputForm from "./CommentInputForm.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";

const CommentItem = ({comment,isChild,onAddReply,onDelete}) => {

    /* 대댓글이 달려있는지 상태 확인 */
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState("")
    const {isLoggedIn} = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("")
    
    
    // 답글 등록 시 실행될 핸들러
    const handleReplySubmit = async (data) => {
        await onAddReply({ ...data, parentId: comment.id });

        // 통신에 성공했다면 답글 입력창을 닫아줍니다.
        setIsReplying(false);
    };


    const handleDeleteClick = () => {
        if (isLoggedIn){
            handleConfirmDelete();
        }else {
            setIsDeleting(!isDeleting);
            setIsReplying(false); // 답글 창이 열려있다면 닫기
            setDeletePassword(""); // 취소할 때 비밀번호 초기화
        }

    };

    const handleConfirmDelete = async () => {

        if(!isLoggedIn && !deletePassword.trim()){
            setErrorMessage("비밀번호를 입력해 주세요");
            return;
        }

        const confirm = window.confirm("정말 삭제하시겠습니까?");
        if(!confirm) return;

        try {
            await onDelete(comment.id,deletePassword);
            setIsDeleting(!isDeleting);
            setIsReplying(false); // 답글 창이 열려있다면 닫기
            setDeletePassword(""); // 취소할 때 비밀번호 초기화
        }catch (e){
            setErrorMessage(e.message);
        }
    };

    return (
        <Box sx={{
            ml: isChild ? 4 : 0, // 대댓글이면 왼쪽 여백을 줘서 들여쓰기 효과
            mt: 2,
            mb: 2,
            p: 2,
            bgcolor: isChild ? 'background.paper' : 'transparent', // 대댓글은 살짝 다른 배경색
            borderRadius: 2
        }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography fontWeight="bold">{comment.authorName}</Typography>
            </Stack>

            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                {/* 인스타그램 방식의 멘션 타겟 표시 */}
                {comment.mentionedName && (
                    <Typography variant="body2" component={"span"} sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        @{comment.mentionedName}
                    </Typography>
                )}
                {comment.content}

            </Typography>

            {/* 답글 달기 버튼 (토글) */}
            <Stack direction="row" spacing={2}>
                <Button
                    size="small"
                    color="inherit"
                    sx={{ opacity: 0.7 }}
                    onClick={() => {
                        setIsReplying(!isReplying)
                        setIsDeleting(false)
                    }}
                >
                    {isReplying ? '취소' : '답글 달기'}
                </Button>

                <Button
                    size="small"
                    color="error"
                    sx={{ opacity: 0.7 }}
                    onClick={handleDeleteClick}
                >
                    {isDeleting ? `취소` : `삭제`}
                </Button>

            </Stack>

            {/* 답글 창이 열렸을 때만 재사용 폼 렌더링 */}
            {isReplying && (
                <Box sx={{ mt: 2 }}>
                    <CommentInputForm
                        onSubmit={handleReplySubmit}
                        isLoggedIn={isLoggedIn}/>
                </Box>
            )}

            <ErrorMessage errorMessage={errorMessage}/>


            {/* 삭제 비밀번호 입력  */}
            {isDeleting && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2 }}>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="비밀번호"
                            type="password"
                            size="small"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                        />

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleConfirmDelete}
                        >
                            확인
                        </Button>
                    </Stack>
                </Box>
            )}
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default CommentItem;