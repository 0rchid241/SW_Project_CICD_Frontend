import React, {useEffect, useState} from 'react';
import Post from "./Post.jsx";
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Typography
} from "@mui/material";
import {data, useNavigate, useParams} from "react-router-dom";

const PostListPage = () => {

    const [postDataList, setPostDatas] = useState([]);
    const navigate = useNavigate();
    const [boardInfo, setBoardInfo] = useState(null)

    const [loading, setLoading] = useState(true)
    
    const {urlPath} = useParams()

    const [searchType, setSearchType] = useState("all");
    const [keyword, setKeyword] = useState("");
    const [searchResultList, setSearchResultList] = useState(null);
    const [message, setMessage] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!keyword.trim()) {
            setMessage("검색어를 입력해주세요.");
            return;
        }

        try {
            setMessage("");

            const response = await fetch(`/api/community/board/${urlPath}/posts/search?type=${searchType}&keyword=${encodeURIComponent(keyword)}`);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "검색에 실패했습니다.");
            }

            const data = await response.json();
            setSearchResultList(data);

            if (data.length === 0) {
                setMessage("검색 결과가 없습니다.");
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || "검색 중 오류가발생했습니다.");
        }
    };

    const handleResetSearch = () => {
        setKeyword("");
        setSearchResultList(null);
        setMessage("");
    };

    useEffect(() => {
        const getAllPost = async () => {

            try {
                const [boardResponse,postResponse] = await Promise.all([
                    fetch(`/api/community/board/${urlPath}`),
                    fetch(`/api/community/board/${urlPath}/allPost`)
                ])
                const boardData = await boardResponse.json();
                const postData = await postResponse.json();

                setBoardInfo(boardData);
                setPostDatas(postData);
                setLoading(false);
            } catch (e) {
                console.log(`getALlPost api받다가 오류남: ${e}`);
            }
        }
        getAllPost();
    }, []);


    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || !boardInfo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress /> {/* MUI 로딩 스피너 */}
            </Box>
        );
    }

    const displayPostList = searchResultList === null ? postDataList : searchResultList;

    return (

        <Box>
            <TableContainer>
                <h1>{boardInfo.name}</h1>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>번호</TableCell>
                            <TableCell align={"center"}>제목</TableCell>
                            <TableCell align={"center"}>글쓴이</TableCell>
                            <TableCell align={"center"}>작성일</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {displayPostList.map((post) => (
                            <Post key={post.id} data={post} urlPath={urlPath}></Post>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/board/${urlPath}/write`)} // 클릭 시 /write URL로 이동
                >글쓰기
                </Button>
            </Box>

            <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1, mb: 2 }}>
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

                <Button type="submit" variant="contained">검색</Button>
                <Button type="button" variant="outlined" onClick={handleResetSearch}>초기화</Button>
            </Box>

            {message && (
                <Typography sx={{ mb: 2 }} color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default PostListPage;