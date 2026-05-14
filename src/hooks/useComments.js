import React, {useContext, useEffect, useState} from 'react';
import {AuthContext, useAuth} from "../context/AuthContext.jsx";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const useComments = (urlPath,postId) => {

    const [commentDataList, setCommentDataList] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const {role} = useAuth();

    const isAdmin = role === `ROLE_SUPER_ADMIN` || role === `ROLE_COMMUNITY_ADMIN`;


    useEffect(() => {
        /* 댓글 데이터들 fetch */
        const fetchComments = async () =>{
            try {
                const response = await apiFetch(`/api/community/board/${urlPath}/post/${postId}/comment/getComments`)
                const data = await response.json();
                setCommentDataList(data);
            }catch (e) {
                console.log(`댓글목록 가져오던 중 오류발생  ${e.message}`);
            }
        }

        if(postId){
            fetchComments();
        }
    }, [urlPath,postId,refreshTrigger]);


    /* 댓글 작성 핸들러
        * 댓글, 댓글 리스트 컴포넌트에서 얘를 가져다가 쓸것 */
    const createComment = async (commentData) => {

        await apiFetch(`/api/community/board/${urlPath}/post/${postId}/comment/write`, {
            method: "POST",
            body: JSON.stringify({
                authorName: commentData.authorName,
                password: commentData.password,
                content: commentData.content,
                parentId: commentData.parentId
            })
        })
        alert("댓글이 성공적으로 등록됐습니다.")
        setRefreshTrigger(prev => prev + 1);

    }

    /* 댓글 삭제 APi 호출 */
    const deleteComment = async (commentId, password = "") => {

        /* 공통옵션 */
        const requestOptions = {
            method: "DELETE",
        };

        /* 관리자 전용 삭제 API 호출 */
        if(isAdmin){
            console.log("관리자 권한으로 댓글 삭제 시작")
            const reason = prompt("관리자 권한으로 삭제합니다. 삭제 사유를 입력하세요:");
            if(!reason) return;

            requestOptions.body = JSON.stringify({reason});

            await apiFetch(`/api/admin/community/board/${urlPath}/post/${postId}/comment/${commentId}`,requestOptions);
        }


        /* 관리자가 아닐경우 */
        else{
            console.log("일반적인 댓글 삭제 시작")
            if(password) {
                requestOptions.body = JSON.stringify({password});
            }
            await apiFetch(`/api/community/board/${urlPath}/post/${postId}/comment/${commentId}`, requestOptions);
        }

        alert("댓글이 성공적으로 삭제되었습니다.");
        setRefreshTrigger(prev => prev + 1); // 목록 새로고침
    }

    return {
        commentDataList,
        createComment,
        deleteComment
    };
};

export default useComments;