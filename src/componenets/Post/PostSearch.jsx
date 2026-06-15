import React, { useState } from 'react';

const PostSearch = ({ onSearch, onReset, loading }) => {

    const [searchType, setSearchType] = useState("all");
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({
            type: searchType,
            keyword: keyword,
        });
    };

    const handleReset = () => {
        setKeyword("");
        setSearchType("all");
        onReset();
    };

    return (
        <form className="dc-search-container dc-flex-row gap-1" onSubmit={handleSubmit}>
            <select
                className="dc-search-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="author">작성자</option>
            </select>

            <input
                type="text"
                className="dc-search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
            />

            <button type="submit" className="dc-btn dc-btn-md dc-btn-primary" disabled={loading}>
                {loading ? "검색 중" : "검색"}
            </button>

            <button type="button" className="dc-btn dc-btn-md dc-btn-outline" onClick={handleReset}>
                초기화
            </button>
        </form>
    );
};

export default PostSearch;