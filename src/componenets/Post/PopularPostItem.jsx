import React from 'react';
import UserItem from "../user/UserItem.jsx";
import {useNavigate} from "react-router-dom";
import {formatDate} from "../util/dateFormater.js";

const PopularPostItem = ({data}) => {

    const navigate = useNavigate();

    return (
        <tr>
            <td
                align="left"
                style={{ cursor: 'pointer', textAlign: 'left', paddingLeft: '16px' }}
                onClick={() => navigate(`/board/${data.urlPath}/post/${data.postId}`)}
            >
                {data.title}
            </td>
            <td>
                <UserItem authorId={data.userId} authorName={data.authorName}/>
            </td>
            <td>{data.viewCount ?? 0}</td>
            <td>{formatDate(data.createAt)}</td>
            <td>{data.score}</td>
        </tr>
    );
};

export default PopularPostItem;