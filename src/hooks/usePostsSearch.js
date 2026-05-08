import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

/* 검색한 게시글들을 불러오는 함수 */
export const usePostsSearch = (urlPath) => {

    const [searchResultList, setSearchResultList] = useState(null);
    const [searchMessage, setSearchMessage] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);


    const searchPosts = useCallback(async ({type, keyword }) => {
        const trimmedKeyword = keyword.trim();

        if (!trimmedKeyword) {
            setSearchMessage("검색어를 입력해주세요.");
            return;
        }

        try {
            setSearchLoading(true);
            setSearchMessage("");

            const response = await apiFetch(`/api/community/board/${urlPath}/posts/search?type=${type}&keyword=${encodeURIComponent(trimmedKeyword)}`);

            const data = await response.json();

            setSearchResultList(data);

            if (data.length === 0) {
                setSearchMessage("검색 결과가 없습니다.");
            }
        } catch (err) {
            console.error(err);
            setSearchMessage(err.message || "검색 중 오류가 발생했습니다.");
        } finally {
            setSearchLoading(false);
        }
    }, [urlPath]);

    const resetSearch = useCallback(() => {
        setSearchResultList(null);
        setSearchMessage("");
    }, []);

    useEffect(() => {
        setSearchResultList(null);
        setSearchMessage("");
    }, [urlPath]);

    return {searchResultList, searchMessage, searchLoading, searchPosts, resetSearch};
}