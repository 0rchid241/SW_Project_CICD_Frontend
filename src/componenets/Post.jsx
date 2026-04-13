import React from 'react';
import {TableCell, TableRow} from "@mui/material";

const Post = ({data}) => {

    return (
            <TableRow hover sx={{cursor: 'pointer'}}>
                <TableCell align="center">{data.id}</TableCell>
                <TableCell align="left">{data.title}</TableCell>
                <TableCell align="center">{data.authorName}</TableCell>
                <TableCell align="center">{data.createAt}</TableCell>
            </TableRow>
    );
};

export default Post;