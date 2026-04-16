import React from 'react';
import {Button, Dialog, Table, TableCell, TableRow} from "@mui/material";
import {useNavigate} from "react-router-dom";

const Post = ({data}) => {

    const navigate = useNavigate();


    return (
        <TableRow hover sx={{cursor: 'pointer'}}>
            <TableCell align="center">{data.id}</TableCell>
            {/* 제목 클릭 시 각 id별 상세페이지로 이동 */}
            <TableCell align="left" onClick={() => navigate(`/post/${data.id}`)}>{data.title}</TableCell>
            <TableCell align="center">{data.authorName}</TableCell>
            <TableCell align="center">{data.createAt}</TableCell>
            <TableCell align="center">
            </TableCell>
        </TableRow>
    );
};

export default Post;