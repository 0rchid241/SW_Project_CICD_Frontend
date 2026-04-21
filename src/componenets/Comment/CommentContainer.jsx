import React, {useEffect, useState} from 'react';
import {Box, Divider, Typography} from "@mui/material";
import CommentList from "./CommentList.jsx";
import CommentInputForm from "./CommentInputForm.jsx";

const CommentContainer = ({urlPath,postId}) => {

    const [commentDataList, setCommentDataList] = useState([])

    /* 댓글이 추가될 때 댓글리스트 다시 렌더링*/
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    /* 댓글 작성 핸들러
    * 댓글, 댓글 리스트 컴포넌트에서 얘를 가져다가 쓸것 */
    const handleCreateComment = async (commentData) =>{

        try {
            const response = await fetch(`/api/community/board/${urlPath}/post/${postId}/comment/write`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    authorName: commentData.authorName,
                    password:commentData.password,
                    content:commentData.content,
                    parentId:commentData.parentId
                })
            })

            if(response.ok){
                setRefreshTrigger(prev => prev + 1);
            }
            return response;

        }catch (e) {
            console.log(`댓글 작성 요청중 오류발생 ${e}`);
        }
    }

    useEffect(() => {
        /* 댓글 데이터들 fetch */
        const fetchComments = async () =>{
            try {
                const response = await fetch(`/api/community/board/${urlPath}/post/${postId}/comment/getComments`)
                if(response.ok){
                    const data = await response.json();
                    setCommentDataList(data);
                }
            }catch (e) {
                console.error("댓글 로딩 중 에러 발생:", e);
            }
        }

        if(postId) {
            fetchComments();
        }
    }, [urlPath,postId,refreshTrigger]);



    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6" fontWeight="bold">댓글</Typography>
            <Divider sx={{ mb: 3, mt: 1 }} />


            {/* 메인 루트 댓글 작성 폼 (상단 고정) */}
            <Box sx={{ mb: 4 }}>
                 <CommentInputForm
                    onSubmit={(data) => handleCreateComment({ ...data, parentId: null })}
                />
            </Box>

            {/* 댓글 리스트 출력 */}
            <CommentList
                commentDataList={commentDataList}
                onAddReply={handleCreateComment}
            />
        </Box>
    );
};

export default CommentContainer;