import {useCallback, useEffect, useState} from 'react';
import {AuthContext, useAuth} from "../context/AuthContext.jsx";
import {apiFetch} from "../componenets/util/apiFetch.js";

const normalizeRole = (role) => {
    if (!role) return null;
    return role.replace(/^ROLE_/, "");
};

const hasAdminPermission = (role) => {
    const normalizedRole = normalizeRole(role);
    return ["SUPER_ADMIN", "COMMUNITY_ADMIN"].includes(normalizedRole);
};

export const useComments = (urlPath, postId, page, size=10) => {

    const [commentDataList, setCommentDataList] = useState([])
    const [commentPageInfo, setCommentPageInfo] = useState({
        page: 0,
        size,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
    });
    const [commentLoading, setCommentLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const {role} = useAuth();

    const isAdmin = hasAdminPermission(role);


    const fetchComments = useCallback(async () => {
        if (!urlPath || !postId) return;

        const params = new URLSearchParams();
        params.append("page", page ?? 0);
        params.append("size", size ?? 10);

        try {
            setCommentLoading(true);

            const response = await apiFetch(
                `/api/community/board/${urlPath}/post/${postId}/comment/getComments?${params.toString()}`
            );

            const data = await response.json();

            if (Array.isArray(data)) {
                setCommentDataList(data);
                setCommentPageInfo({
                    page: 0,
                    size: data.length,
                    totalPages: 1,
                    totalElements: data.length,
                    first: true,
                    last: true,
                });
                return;
            }

            setCommentDataList(Array.isArray(data.content) ? data.content : []);

            setCommentPageInfo({
                page: data.page ?? 0,
                size: data.size ?? size,
                totalPages: data.totalPages ?? 0,
                totalElements: data.totalElements ?? 0,
                first: data.first ?? true,
                last: data.last ?? true,
            });
        } catch (e) {
            console.error(`댓글목록 가져오던 중 오류발생 ${e.message}`);
        } finally {
            setCommentLoading(false);
        }
    }, [urlPath, postId, page, size, refreshTrigger]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);


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


    /* 댓글 비밀번호 사전 검증 API */
    const verifyCommentPassword = async (commentId, password) => {
        await apiFetch(`/api/community/board/${urlPath}/post/${postId}/comment/${commentId}/verify-password`, {
            method: "POST",
            body: JSON.stringify({ password })
        });
    };

    /* 댓글 수정 API */
    const updateComment = async (commentId, requestBody) => {
        await apiFetch(`/api/community/board/${urlPath}/post/${postId}/comment/${commentId}`, {
            method: "PUT",
            body: JSON.stringify(requestBody)
        });
        alert("댓글이 성공적으로 수정되었습니다.");
        setRefreshTrigger(prev => prev + 1);
    };

    return {
        commentDataList,
        commentPageInfo,
        commentLoading,
        fetchComments,
        createComment,
        deleteComment,
        verifyCommentPassword,
        updateComment
    };
};

export default useComments;