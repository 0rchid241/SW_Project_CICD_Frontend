import React, {useContext, useEffect, useState} from 'react';
import {Box, Divider, Typography} from "@mui/material";
import CommentList from "./CommentList.jsx";
import CommentInputForm from "./CommentInputForm.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {apiFetch} from "../util/apiFetch.js";
import useComments from "../../hooks/useComments.js";

const CommentSection = ({urlPath,postId}) => {

    const {isLoggedIn} = useContext(AuthContext);
    const {commentDataList,createComment, deleteComment}=useComments(urlPath,postId);


    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6" fontWeight="bold">댓글</Typography>
            <Divider sx={{ mb: 3, mt: 1 }} />

            {/* 메인 루트 댓글 작성 폼 (상단 고정) */}
            <Box sx={{ mb: 4 }}>
                 <CommentInputForm
                    onSubmit={(data) => createComment({ ...data, parentId: null })}
                    isLoggedIn={isLoggedIn}
                />
            </Box>

            {/* 댓글 리스트 출력 */}
            <CommentList
                commentDataList={commentDataList}
                onAddReply={createComment}
                onDelete={deleteComment}
                isFlatList={false}
            />
        </Box>
    );
};

export default CommentSection;