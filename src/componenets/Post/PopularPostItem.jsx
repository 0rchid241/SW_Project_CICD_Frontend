import React from 'react';
import {TableCell, TableRow} from "@mui/material";
import UserItem from "../user/UserItem.jsx";
import {useNavigate} from "react-router-dom";

const PopularPostItem = ({data}) => {


    const navigate = useNavigate();

    return (
        <TableRow hover sx={{cursor: 'pointer'}} >
            <TableCell align="center">{data.id}</TableCell>
            {/* 제목 클릭 시 각 id별 상세페이지로 이동 */}
            <TableCell align="left" onClick={() => navigate(`/board/${data.urlPath}/post/${data.postId}`)}>{data.title}</TableCell>
            <TableCell align="center">
                <UserItem authorId={data.userId} authorName={data.authorName}/>
            </TableCell>
            <TableCell align="center">{data.viewCount ?? 0}</TableCell>
            <TableCell align="center">{data.createAt}</TableCell>
            <TableCell align="center">
            </TableCell>
        </TableRow>
    );
};

export default PopularPostItem;