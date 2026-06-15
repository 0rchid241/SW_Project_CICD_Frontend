import React from 'react';
import {Box, Button, Dialog, Table, TableCell, TableRow, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import UserItem from "../user/UserItem.jsx";
import {formatDate} from "../util/dateFormater.js";

const PostItem = ({data,urlPath}) => {

    const navigate = useNavigate();

    return (
        <TableRow hover sx={{cursor: 'pointer'}} >
            <TableCell align="center">{data.id}</TableCell>
            <TableCell align="center">{data.categoryName}</TableCell>

            {/* 제목 클릭 시 각 id별 상세페이지로 이동 */}
            <TableCell align="left" onClick={() => navigate(`/board/${urlPath}/post/${data.id}`)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{data.title}</Typography>

                    {/* 댓글이 1개 이상일 때만 빨간색으로 표시 */}
                    {data.commentCount > 0 && (
                        <Typography variant="caption" color="error" fontWeight="bold">
                            [{data.commentCount}]
                        </Typography>
                    )}
                </Box>
            </TableCell>


            <TableCell align="center">
                <UserItem authorId={data.userId} authorName={data.authorName}/>
            </TableCell>
            <TableCell align="center">{formatDate(data.createAt)}</TableCell>
            <TableCell align="center">{data.viewCount ?? 0}</TableCell>
            <TableCell align="center">{data.likeCount ?? 0}</TableCell>
            <TableCell align="center">
            </TableCell>
        </TableRow>
    );
};

export default PostItem;