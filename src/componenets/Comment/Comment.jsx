import React, {useState} from 'react';
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import CommentInputForm from "./CommentInputForm.jsx";

const Comment = ({comment,isChild,onAddReply}) => {

    /* 대댓글이 달려있는지 상태 확인 */
    const [isReplying, setIsReplying] = useState(false);


    // 답글 등록 시 실행될 핸들러
    const handleReplySubmit = async (data) => {
        const isSuccess = await onAddReply({ ...data, parentId: comment.id });

        // 통신에 성공했다면 답글 입력창을 닫아줍니다.
        if (isSuccess) {
            setIsReplying(false);
        }
        return isSuccess; // InputForm이 입력창을 비울지 말지 결정하도록 결과 반환
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
                    onClick={() => setIsReplying(!isReplying)}
                >
                    {isReplying ? '취소' : '답글 달기'}
                </Button>
            </Stack>

            {/* 답글 창이 열렸을 때만 재사용 폼 렌더링 */}
            {isReplying && (
                <Box sx={{ mt: 2 }}>
                    <CommentInputForm onSubmit={handleReplySubmit} />
                </Box>
            )}

            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default Comment;