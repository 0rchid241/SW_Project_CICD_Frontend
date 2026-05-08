import React, {useEffect, useState} from 'react';
import {useMyPage} from "../../../hooks/useMyPage.js";
import {Box, CircularProgress} from "@mui/material";
import CommentList from "../../Comment/CommentList.jsx";
import MyCommentsTable from "./MyCommentsTable.jsx";

const MyCommentsContainer = () => {

    const {fetchMyComments} = useMyPage();
    const [myCommentData, setMyCommentData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState()

    useEffect(() => {
        const loadMyComments = async () =>{
            try {
                setLoading(true);
                const data = await fetchMyComments();
                setMyCommentData(data);
            }catch (e) {
                setError(e.message)
            }finally {
                setLoading(false);
            }
        }

        loadMyComments();
    }, [fetchMyComments]);


    // 로딩중
    if (loading) return <CircularProgress/>;

    return (
        <div>
            <MyCommentsTable commentDataList={myCommentData} errorMessage={error}/>
        </div>
    );
};

export default MyCommentsContainer;