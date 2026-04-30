import React, {useEffect, useState} from 'react';
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
import Post from "./Post.jsx";
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../util/apiFetch.js";

const PopularPostListPage = () => {

    const [loading, setLoading] = useState(true);
    const [postDataList, setPostDataList] = useState([])
    const navigate = useNavigate();


    useEffect(() => {

        const fetchPopularPostData = async ()=>{
            try {
                const response = await apiFetch('/api/community/board/popular/');
                const data = await response.json();
                setPostDataList(data);
                setLoading(false)

            }catch (e) {
                console.log(`인기글 불러오다가 오류 발생. ${e} `);
            }
        }
        fetchPopularPostData();

    }, []);


    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || postDataList.length===0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress /> {/* MUI 로딩 스피너 */}
            </Box>
        );
    }

    return (

        <Box>
            <TableContainer>
                <h1>인기 게시글</h1>
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
                            <Post key={post.id} data={post} urlPath={post.boardUrlPath}></Post>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>


    );
};

export default PopularPostListPage;