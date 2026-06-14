import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../componenets/util/apiFetch.js";

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


    /* 보드에 필요한 데이터 출력 */
    const fetchBoardData = useCallback(async () => {
        if (!urlPath) return;

        const params = new URLSearchParams();
        params.append("page", page ?? 0);
        params.append("size", size);

        // 💡 1. API 요청 URL을 동적으로 설정하기 위한 변수
        let postApiUrl = "";

        // 💡 2. '개념글' 탭이 선택되었을 때와 일반 카테고리일 때를 분리
        if (selectedCategoryId === 'POPULAR') {
            // 개념글 API에는 categoryId나 일반 정렬(sort) 파라미터가 불필요할 수 있으므로 page, size만 보냅니다.
            postApiUrl = `/api/community/board/${urlPath}/popular?${params.toString()}`;
        } else {
            if (selectedCategoryId) {
                params.append("categoryId", selectedCategoryId);
            }
            params.append("sort", sortMode || "latest");
            postApiUrl = `/api/community/board/${urlPath}/allPost?${params.toString()}`;
        }

        try {
            setLoading(true);
            const [boardResponse, postResponse] = await Promise.all([
                apiFetch(`/api/community/board/${urlPath}`),
                apiFetch(postApiUrl) // 💡 3. 분기 처리된 URL로 요청
            ]);

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
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setLoading(false);
        }
    }, [urlPath, selectedCategoryId, sortMode, page, size]);


    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    return { boardInfo, postDataList, pageInfo, loading, errorMessage };
};