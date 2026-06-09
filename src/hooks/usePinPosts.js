import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const usePinPosts = (urlPath) => {
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    /* 고정 글들을 불러오는 함수 */
    const fetchPinnedPosts = useCallback(async () => {
        if (!urlPath) return;

        try {
            setLoading(true);
            setErrorMessage("");

            const response = await apiFetch(`/api/community/board/${urlPath}/posts/pinned`);
            const data = await response.json();

            setPinnedPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    }, [urlPath]);

    useEffect(() => {
        fetchPinnedPosts();
    }, [fetchPinnedPosts]);


    // 💡 새로 추가: 특정 게시글 고정/해제 토글 로직
    const togglePinPost = async (postId) => {
        if (!postId) return false;
        try {
            setLoading(true);
            await apiFetch(`/api/admin/community/board/${urlPath}/posts/${postId}/pin`, {
                method: "PATCH",
                body: JSON.stringify({ postId })
            });
            await fetchPinnedPosts(); // 상태 변경 후 목록 다시 불러오기
            return true; // 성공 여부 반환
        } catch (err) {
            setErrorMessage(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        pinnedPosts,
        loading,
        pinnedMessage:errorMessage,
        fetchPinnedPosts,
        togglePinPost
    };
};