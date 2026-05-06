import React, {useState} from 'react';
import {Box, Typography} from "@mui/material";
import CommentItem from './CommentItem.jsx';


const CommentList = ({commentDataList,onAddReply,onDelete}) => {

    /* 댓글 없을 떄 */
    if (!commentDataList || commentDataList.length === 0) {
        return (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                등록된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </Typography>
        );
    }


    return (
        <Box>
            {/*  루트 댓글 리스트 순회 */}
            {commentDataList.map((rootComment) => (
                <Box key={rootComment.id}>

                    {/* 루트 댓글 렌더링 */}
                    <CommentItem
                        comment={rootComment}
                        isChild={false}
                        onAddReply={onAddReply}
                        onDelete={onDelete}
                    />

                    {/*  루트 댓글 하위에 대댓글(children)이 있다면 순회하여 렌더링 */}
                    {rootComment.children && rootComment.children.map((childComment) => (
                        <CommentItem
                            key={childComment.id}
                            comment={childComment}
                            isChild={true} // 들여쓰기를 위해 true 전달
                            onAddReply={onAddReply}
                            onDelete={onDelete}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default CommentList;