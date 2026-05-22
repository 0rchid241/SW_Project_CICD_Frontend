import React, {useContext, useState} from 'react';
import {Box, Divider, Pagination, Stack, Typography} from "@mui/material";
import CommentList from "./CommentList.jsx";
import CommentInputForm from "./CommentInputForm.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import useComments from "../../hooks/useComments.js";

const CommentSection = ({urlPath,postId}) => {

    const {isLoggedIn} = useContext(AuthContext);
    const [commentPage, setCommentPage] = useState(0);
    const commentPageSize = 10;

    const {
        commentDataList,
        commentPageInfo,
        commentLoading,
        createComment,
        deleteComment,
    } = useComments(urlPath, postId, commentPage, commentPageSize);

    const handleCreateRootComment = async (data) => {
        await createComment({ ...data, parentId: null });
    };

    const handleChangeCommentPage = (event, value) => {
        setCommentPage(value - 1);
    };

    return (
        <Box sx={{ mt: 5 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6" fontWeight="bold">
                    댓글 {commentPageInfo.totalElements ?? 0}
                </Typography>

                {commentLoading && (
                    <Typography variant="body2" color="text.secondary">
                        불러오는 중...
                    </Typography>
                )}
            </Stack>

            <Divider sx={{ mb: 3, mt: 1 }} />

            {/* 메인 루트 댓글 작성 폼 */}
            <Box sx={{ mb: 4 }}>
                <CommentInputForm
                    onSubmit={handleCreateRootComment}
                    isLoggedIn={isLoggedIn}
                />
            </Box>

            {/* 댓글 리스트 출력 */}
            <CommentList
                commentDataList={commentDataList}
                onAddReply={createComment}
                onDelete={deleteComment}
            />

            {/* 댓글 페이지네이션 */}
            {commentPageInfo.totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={commentPageInfo.totalPages}
                        page={commentPage + 1}
                        onChange={handleChangeCommentPage}
                        color="primary"
                        size="small"
                    />
                </Stack>
            )}
        </Box>
    );
};

export default CommentSection;