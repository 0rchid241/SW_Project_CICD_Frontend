import React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";
import { useNavigate, useParams} from "react-router-dom";
import {useBoardPosts} from "../../hooks/useBoardPosts.js";
import PostTable from "./PostTable.jsx";
import LoadingCircle from "../util/LoadingCircle.jsx";
import PostSearch from "./PostSearch.jsx";
import PinnedPost from "./PinnedPost.jsx";
import {usePostsSearch} from "../../hooks/usePostsSearch.js";
import {usePinnedPosts} from "../../hooks/usePinnedPosts.js";

const BoardPage = () => {

    const {urlPath} = useParams()
    const navigate = useNavigate();
    const {boardInfo,postDataList,loading,errorMessage} = useBoardPosts(urlPath);
    const {searchResultList, searchMessage, searchLoading, searchPosts, resetSearch} = usePostsSearch(urlPath);
    const {pinnedPosts, fetchPinnedPosts, pinnedMessage} = usePinnedPosts(urlPath);

    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || !boardInfo) return <LoadingCircle/>


    const displayPostList = searchResultList === null ? postDataList : searchResultList;

    return (
        <>
            {/* 고정 글 목록을 띄우는 컴포넌트 */}
            {pinnedPosts.length > 0 && (
                <PinnedPost defaultUrlPath={urlPath} pinnedPosts={pinnedPosts} errorMessage={pinnedMessage} />
            )}

            {/* 글 목록 띄우는 컴포넌트 */}
            <PostTable defaultUrlPath={urlPath} postDataList={displayPostList} boardInfo={boardInfo} errorMessage={errorMessage}/>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/board/${urlPath}/write`)} // 클릭 시 /write URL로 이동
                >글쓰기
                </Button>
            </Box>

            <PostSearch onSearch={searchPosts} onReset={resetSearch} loading={searchLoading}/>

            {searchMessage && (
                <Typography sx={{ mb: 2 }}
                            color="text.secondary">
                    {searchMessage}
                </Typography>
            )}
        </>

    );
};

export default BoardPage;