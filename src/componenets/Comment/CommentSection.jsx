import React, {useContext, useState} from 'react';
import { Pagination } from "@mui/material"; // Pagination은 복잡도 문제로 임시 유지
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
        updateComment,
        verifyCommentPassword
    } = useComments(urlPath, postId, commentPage, commentPageSize);

    const handleCreateRootComment = async (data) => {
        await createComment({ ...data, parentId: null });
    };

    const handleChangeCommentPage = (event, value) => {
        setCommentPage(value - 1);
    };

    return (
        <div className="mt-3">
            <div className="dc-list-header dc-flex-between mt-2">
                <div>
                    전체 댓글 <span style={{ color: '#ff4d4f' }}>{commentPageInfo.totalElements ?? 0}</span>개
                </div>
                {commentLoading && (
                    <span style={{ fontSize: '12px', color: '#888888', fontWeight: 'normal' }}>
                        불러오는 중...
                    </span>
                )}
            </div>

            <div className="mt-2 mb-3">
                <CommentInputForm
                    onSubmit={handleCreateRootComment}
                    isLoggedIn={isLoggedIn}
                />
            </div>

            <CommentList
                commentDataList={commentDataList}
                onAddReply={createComment}
                onDelete={deleteComment}
                onUpdate={updateComment}
                onVerifyPassword={verifyCommentPassword}
            />

            {commentPageInfo.totalPages > 1 && (
                <div className="dc-flex-row mt-2" style={{ justifyContent: 'center' }}>
                    <Pagination
                        count={commentPageInfo.totalPages}
                        page={commentPage + 1}
                        onChange={handleChangeCommentPage}
                        color="primary"
                        size="small"
                    />
                </div>
            )}
        </div>
    );
};

export default CommentSection;