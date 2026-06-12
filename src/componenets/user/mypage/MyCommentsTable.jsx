import React from 'react';
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import ErrorMessage from "../../util/ErrorMessage.jsx";
import {useNavigate} from "react-router-dom";

const MyCommentsTable = ({commentDataList,errorMessage,title = "내가 쓴 댓글"}) => {

    const navigate = useNavigate();

    return (
        <Box>
            <ErrorMessage errorMessage={errorMessage} />

            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    mb: 3,
                }}
            >
                {title}
            </Typography>

            <TableContainer>

                <Table sx={{ minWidth: 650 }} aria-label="my comments table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width="10%">번호</TableCell>
                            <TableCell align="center" width="50%">댓글 내용</TableCell>
                            {/* 마이페이지 컨텍스트에 맞게 원본 게시글 정보를 표시 */}
                            <TableCell align="center" width="20%">작성한 게시글</TableCell>
                            <TableCell align="center" width="20%">작성일</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {commentDataList && commentDataList.length > 0 ? (
                            commentDataList.map((comment) => (
                                <TableRow
                                    key={comment.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    // 클릭 시 원본 게시글 상세 페이지로 이동
                                    onClick={() => navigate(`/board/${comment.boardUrlPath}/post/${comment.postId}`)}
                                >
                                    <TableCell align="center">{comment.id}</TableCell>
                                    <TableCell align="left">
                                        {/* 내용이 길 경우 말줄임표 처리 등 UI 최적화 가능 */}
                                        {comment.content}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" color="primary">
                                            {comment.postTitle}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">{comment.createAt}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        작성한 댓글이 없습니다.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MyCommentsTable;