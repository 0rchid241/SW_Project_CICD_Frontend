import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem
} from "@mui/material";

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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
                select
                size="small"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                sx={{ width: 130 }}>
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="title">제목</MenuItem>
                <MenuItem value="content">내용</MenuItem>
                <MenuItem value="author">작성자</MenuItem>
            </TextField>

            <TextField
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
                fullWidth/>

            <Button type="submit" variant="contained" disabled={loading}>{loading ? "검색 중" : "검색"}</Button>
            <Button type="button" variant="outlined" onClick={handleReset}>초기화</Button>
        </Box>
    );
};

export default PostSearch;