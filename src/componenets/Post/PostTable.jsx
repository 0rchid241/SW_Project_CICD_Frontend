import React from 'react';
import PostItem from "./PostItem.jsx";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PostTable = ({defaultUrlPath,
                       postDataList,
                       errorMessage}) => {

    return (
        <Box>
            <ErrorMessage errorMessage={errorMessage}/>

            <TableContainer>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>번호</TableCell>
                            <TableCell align={"center"}>카테고리</TableCell>
                            <TableCell align={"center"}>제목</TableCell>
                            <TableCell align={"center"}>글쓴이</TableCell>
                            <TableCell align={"center"}>작성일</TableCell>
                            <TableCell align={"center"}>조회수</TableCell>
                            <TableCell align={"center"}>추천수</TableCell>
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {postDataList.map((post) => (
                            <PostItem
                                key={post.id}
                                data={post}
                                urlPath={defaultUrlPath ?? post.boardUrlPath}>
                            </PostItem>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


        </Box>
    );
};

export default PostTable;