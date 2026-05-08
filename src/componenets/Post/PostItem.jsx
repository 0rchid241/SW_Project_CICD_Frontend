import React from 'react';
import {Button, Dialog, Table, TableCell, TableRow} from "@mui/material";
import {useNavigate} from "react-router-dom";
import UserItem from "../user/UserItem.jsx";

const PostItem = ({data,urlPath}) => {

    const navigate = useNavigate();

    return (
        <TableRow hover sx={{cursor: 'pointer'}} onClick={() => navigate(`/board/${urlPath}/post/${data.id}`)}>
            <TableCell align="center">{data.id}</TableCell>
            {/* 제목 클릭 시 각 id별 상세페이지로 이동 */}
            <TableCell align="left" >{data.title}</TableCell>
            <TableCell align="center">
                <UserItem authorId={data.userId} authorName={data.authorName}/>
            </TableCell>
            <TableCell align="center">{data.createAt}</TableCell>
            <TableCell align="center">
            </TableCell>
        </TableRow>
    );
};

export default PostItem;