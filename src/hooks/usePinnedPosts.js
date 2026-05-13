import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

/* 고정 글들을 불러오는 함수 */
export const usePinnedPosts = (urlPath) => {
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pinnedMessage, setPinnedMessage] = useState("");

    const fetchPinnedPosts = useCallback(async () => {
        if (!urlPath) return;

        try {
            setLoading(true);
            setPinnedMessage("");

            const data = await apiFetch(`/api/community/board/${urlPath}/posts/pinned`);
            setPinnedPosts(data);
        } catch (err) {
            setPinnedMessage(err.message);
        } finally {
            setLoading(false);
        }
    }, [urlPath]);

    useEffect(() => {
        fetchPinnedPosts();
    }, [fetchPinnedPosts]);

    return {
        pinnedPosts,
        loading,
        pinnedMessage,
        fetchPinnedPosts,
    };
};