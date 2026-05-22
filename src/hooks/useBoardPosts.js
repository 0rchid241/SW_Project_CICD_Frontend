import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

/* 게시판의 게시글들을 불러오는 함수 */
export const useBoardPosts = (urlPath, selectedCategoryId, sortMode, page, size = 10) => {

    const [postDataList, setPostDatas] = useState([]);
    const [boardInfo, setBoardInfo] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchBoardData = useCallback(async () => {
        if (!urlPath) return;

        const params = new URLSearchParams();

        if (selectedCategoryId) {
            params.append("categoryId", selectedCategoryId);
        }

        params.append("sort", sortMode || "latest");
        params.append("page", page ?? 0);
        params.append("size", size);

        const query = `?${params.toString()}`;

        try {
            setLoading(true);
            const [boardResponse, postResponse] = await Promise.all([
                apiFetch(`/api/community/board/${urlPath}`),
                apiFetch(`/api/community/board/${urlPath}/allPost${query}`)
            ])
            const boardData = await boardResponse.json();
            const postData = await postResponse.json();

            setBoardInfo(boardData);
            setPostDatas(postData.content || []);
            setPageInfo({
                page: postData.page,
                size: postData.size,
                totalPages: postData.totalPages,
                totalElements: postData.totalElements,
                first: postData.first,
                last: postData.last,
            });
        }catch (e){
            setErrorMessage(e.message);
        }finally {
            setLoading(false);
        }
    }, [urlPath, selectedCategoryId, sortMode, page, size]);


    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    return {boardInfo,postDataList,pageInfo,loading,errorMessage}
}