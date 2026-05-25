import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress, Pagination, Stack,
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
import {useCategories} from "../../hooks/useCategories.js";
import CategoryTabs from "./CategoryTabs.jsx";

const BoardPage = () => {

    const {urlPath} = useParams()
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [sortMode, setSortMode] = useState("latest");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const {categories, categoryMessage} = useCategories(urlPath);
    const {boardInfo,postDataList, pageInfo, loading,errorMessage} = useBoardPosts(urlPath, selectedCategoryId, sortMode, currentPage, pageSize);
    const {searchResultList, searchMessage, searchLoading, searchPosts, resetSearch} = usePostsSearch(urlPath);
    const {pinnedPosts, fetchPinnedPosts, pinnedMessage} = usePinnedPosts(urlPath);

    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || !boardInfo) return <LoadingCircle/>

    const displayPostList = searchResultList === null ? postDataList : searchResultList;

    /* 카테고리 변경 시 1페이지로 돌아가기 */
    const handleSelectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(0);
    };

    /* 정렬 변경 시 1페이지로 돌아가기 */
    const handleChangeSort = (sort) => {
        setSortMode(sort);
        setCurrentPage(0);
    };


    return (
        <>
            {/* 고정 글 목록을 띄우는 컴포넌트 */}
            {pinnedPosts.length > 0 && (
                <PinnedPost defaultUrlPath={urlPath} pinnedPosts={pinnedPosts} errorMessage={pinnedMessage} />
            )}

            {/* 제목 */}
            <Typography variant="h1">
                {boardInfo?.name|| `내가 쓴 글`}
            </Typography>

            {/* 카테고리 목록 띄우는 컴포넌트 */}
            <CategoryTabs categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={handleSelectCategory}/>

            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
                <Button
                    size="small"
                    variant={sortMode === "latest" ? "contained" : "outlined"}
                    onClick={() => handleChangeSort("latest")}
                >
                    최신순
                </Button>
                <Button
                    size="small"
                    variant={sortMode === "view" ? "contained" : "outlined"}
                    onClick={() => handleChangeSort("view")}
                >
                    조회수순
                </Button>
            </Stack>

            {/* 글 목록 띄우는 컴포넌트 */}
            <PostTable defaultUrlPath={urlPath} postDataList={displayPostList} errorMessage={errorMessage}/>

            {/* 게시글 페이지 선택 */}
            {pageInfo.totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={pageInfo.totalPages}
                        page={currentPage + 1}
                        onChange={(event, value) => setCurrentPage(value - 1)}
                        color="primary"
                    />
                </Stack>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:3}}>
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