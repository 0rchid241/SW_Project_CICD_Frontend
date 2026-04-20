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
    TableRow
} from "@mui/material";
import {data, useNavigate, useParams} from "react-router-dom";

const PostListPage = () => {

    const [postDataList, setPostDatas] = useState([]);
    const navigate = useNavigate();
    const [boardInfo, setBoardInfo] = useState(null)

    const [loading, setLoading] = useState(true)
    
    
    const {urlPath} = useParams()

    useEffect(() => {
        const getAllPost = async () => {

            try {
                const [boardResponse,postResponse] = await Promise.all([
                    fetch(`/api/community/${urlPath}/board`),
                    fetch(`/api/community/${urlPath}/allPost`)
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
                        {postDataList.map((post) => (
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
        </Box>


    );
};

export default PostListPage;