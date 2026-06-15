import React, { useEffect, useState } from 'react';
import { Pagination, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useBoardPosts } from "../../hooks/useBoardPosts.js";
import PostTable from "./PostTable.jsx";
import LoadingCircle from "../util/LoadingCircle.jsx";
import PostSearch from "./PostSearch.jsx";
import PinnedPost from "./PinnedPost.jsx";
import { usePostsSearch } from "../../hooks/usePostsSearch.js";
import { usePinPosts } from "../../hooks/usePinPosts.js";
import { useCategories } from "../../hooks/useCategories.js";
import CategoryTabs from "./CategoryTabs.jsx";
import { isAdmin } from "../util/roleUtils.js";
import { useAuth } from "../../context/AuthContext.jsx";

const BoardPage = () => {
    const { urlPath } = useParams()
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [sortMode, setSortMode] = useState("latest");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const { categories, fetchActiveCategories } = useCategories(urlPath);
    const { boardInfo, postDataList, pageInfo, loading, errorMessage } = useBoardPosts(urlPath, selectedCategoryId, sortMode, currentPage, pageSize);
    const { searchResultList, searchMessage, searchLoading, searchPosts, resetSearch } = usePostsSearch(urlPath);
    const { pinnedPosts, pinnedMessage } = usePinPosts(urlPath);

    const { role } = useAuth();

    useEffect(() => {
        fetchActiveCategories()
    }, [fetchActiveCategories]);

    if (loading || !boardInfo) return <LoadingCircle/>

    const displayPostList = searchResultList === null ? postDataList : searchResultList;

    const handleSelectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(0);
    };

    const handleChangeSort = (sort) => {
        setSortMode(sort);
        setCurrentPage(0);
    };

    return (
        <>
            {pinnedPosts.length > 0 && (
                <PinnedPost defaultUrlPath={urlPath} pinnedPosts={pinnedPosts} errorMessage={pinnedMessage} />
            )}

            <div className="dc-flex-between mt-2 mb-2">
                <div /> {/* flex-between 공간 맞춤용 */}
                {isAdmin(role) && (
                    <button className="dc-btn dc-btn-sm dc-btn-danger" onClick={() => navigate(`/board/${urlPath}/admin`)}>
                        ⚙️ 커뮤니티 관리
                    </button>
                )}
            </div>

            <CategoryTabs categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={handleSelectCategory}/>

            {/* mt-3을 추가하여 위 간격을 벌리고, 카테고리 탭과 줄을 맞추기 위해 paddingLeft를 8px 줌 */}
            <div className="dc-flex-row gap-1 mt-3 mb-2" style={{ marginLeft: '8px' }}>
                <button
                    className={`dc-btn dc-btn-sm dc-btn-dark ${sortMode === "latest" ? "active" : ""}`}
                    onClick={() => handleChangeSort("latest")}
                >
                    최신순
                </button>
                <button
                    className={`dc-btn dc-btn-sm dc-btn-dark ${sortMode === "view" ? "active" : ""}`}
                    onClick={() => handleChangeSort("view")}
                >
                    조회수순
                </button>
            </div>

            <PostTable defaultUrlPath={urlPath} postDataList={displayPostList} errorMessage={errorMessage}/>

            {pageInfo.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                    <Pagination
                        count={pageInfo.totalPages}
                        page={currentPage + 1}
                        onChange={(event, value) => setCurrentPage(value - 1)}
                        color="primary"
                    />
                </div>
            )}

            <div className="dc-flex-end mb-3">
                <button
                    className="dc-btn dc-btn-md dc-btn-primary"
                    onClick={() => navigate(`/board/${urlPath}/write`)}
                >
                    글쓰기
                </button>
            </div>

            <PostSearch onSearch={searchPosts} onReset={resetSearch} loading={searchLoading}/>

            {searchMessage && (
                <Typography sx={{ mb: 2 }} color="text.secondary">
                    {searchMessage}
                </Typography>
            )}
        </>
    );
};

export default BoardPage;