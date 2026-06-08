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
import {apiFetch} from "../util/apiFetch.js";
import LoadingCircle from "../util/LoadingCircle.jsx";
import PopularPostItem from "./PopularPostItem.jsx";

const PopularPostListPage = () => {

    const [loading, setLoading] = useState(true);
    const [postDataList, setPostDataList] = useState([])


    useEffect(() => {

        const fetchPopularPostData = async ()=>{
            try {
                const response = await apiFetch('/api/community/board/popular/realtime-popular');
                const data = await response.json();
                setPostDataList(data);
                setLoading(false)

            }catch (e) {
                console.log(`인기글 불러오다가 오류 발생. ${e} `);
            }
        }
        fetchPopularPostData();

        // 2. 10초(10000ms)마다 백그라운드에서 주기적으로 데이터 갱신
        const intervalId = setInterval(fetchPopularPostData, 10000);

        // 3. 컴포넌트가 화면에서 사라질 때 타이머 정리 (메모리 누수 방지)
        return () => clearInterval(intervalId);

    }, []);


    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || postDataList.length===0) {
        return (
            <LoadingCircle/>
        );
    }

    return (

        <Box>
            <TableContainer>
                <h1>인기 게시글</h1>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>제목</TableCell>
                            <TableCell align={"center"}>글쓴이</TableCell>
                            <TableCell align={"center"}>조회수</TableCell>
                            <TableCell align={"center"}>작성일</TableCell>
                            <TableCell align={"center"}>/점수/</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {postDataList.map((post) => (
                            //<PostItem key={post.postId} data={post} urlPath={post.urlPath}></PostItem>
                            <PopularPostItem key={post.postId} data={post}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>


    );
};

export default PopularPostListPage;