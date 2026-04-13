import React, {useEffect, useState} from 'react';
import Post from "./Post.jsx";
import {Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useNavigate} from "react-router-dom";

const PostListPage = () => {

    const [postDataList, setPostDatas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const getAllPost = async () => {

            try {
                const response = await fetch("http://localhost:8080/community/getAllPost");
                const data = await response.json();
                setPostDatas(data);
            } catch (e) {
                console.log(`getALlPost api받다가 오류남: ${e}`);
            }
        }
        getAllPost();
    }, []);


    return (

        <Box>
            <TableContainer>
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
                            <Post key={post.id} data={post}></Post>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => navigate('/write')} // 클릭 시 /write URL로 이동
                >글쓰기
                </Button>
            </Box>
        </Box>


    );
};

export default PostListPage;