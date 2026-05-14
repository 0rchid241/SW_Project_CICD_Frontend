import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";



/* 게시판의 게시글들을 불러오는 함수 */
export const useBoardPosts = (urlPath, selectedCategoryId) => {

    const [postDataList, setPostDatas] = useState([]);
    const [boardInfo, setBoardInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    const fetchBoardData = useCallback(async () => {
        const query = selectedCategoryId ? `?categoryId=${selectedCategoryId}` : "";
        try {
            setLoading(true);
            const [boardResponse, postResponse] = await Promise.all([
                apiFetch(`/api/community/board/${urlPath}`),
                apiFetch(`/api/community/board/${urlPath}/allPost${query}`)
            ])
            const boardData = await boardResponse.json();
            const postData = await postResponse.json();

            setBoardInfo(boardData);
            setPostDatas(postData);
        }catch (e){
            setErrorMessage(e.message);
        }finally {
            setLoading(false);
        }
    }, [urlPath, selectedCategoryId]);


    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    return {boardInfo,postDataList,loading,errorMessage}
}