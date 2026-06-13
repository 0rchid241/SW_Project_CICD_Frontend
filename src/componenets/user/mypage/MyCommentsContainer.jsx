import React, {useEffect, useState} from 'react';
import {useMyPage} from "../../../hooks/useMyPage.js";
import {Box, CircularProgress} from "@mui/material";
import CommentList from "../../Comment/CommentList.jsx";
import MyCommentsTable from "./MyCommentsTable.jsx";

const MyCommentsContainer = ({
                                 userId = null,
                                 title = null,
                             }) => {

    const {fetchMyComments, fetchUserComments} = useMyPage();
    const [myCommentData, setMyCommentData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState()

    useEffect(() => {
        const loadComments = async () =>{
            try {
                setLoading(true);
                const data = userId
                    ? await fetchUserComments(userId)
                    : await fetchMyComments();
                setMyCommentData(data);
            }catch (e) {
                setError(e.message)
            }finally {
                setLoading(false);
            }
        }

        loadComments();
    }, [userId, fetchMyComments, fetchUserComments]);


    // 로딩중
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <MyCommentsTable commentDataList={myCommentData}
                             errorMessage={error}
                             title={title || (userId ? "작성한 댓글" : "내가 쓴 댓글")}
            />
        </div>
    );
};

export default MyCommentsContainer;