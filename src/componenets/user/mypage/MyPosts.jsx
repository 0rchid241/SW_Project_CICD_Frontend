import React, {useEffect, useState} from 'react';
import {useMyPage} from "../../../hooks/useMyPage.js";
import PostTable from "../../Post/PostTable.jsx";
import {Box, CircularProgress} from "@mui/material";

const MyPosts = ({ userId = null }) => {

    const {fetchMyPosts, fetchUserPosts} = useMyPage();
    const [error, setError] = useState("")
    const [postData, setPostData] = useState([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = userId
                    ? await fetchUserPosts(userId)
                    : await fetchMyPosts();
                setPostData(data);
            }catch (e) {
                setError(e.message);
            }finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, [userId, fetchMyPosts, fetchUserPosts]);



// 로딩 중일 때 보여줄 UI (UX 개선)
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PostTable errorMessage={error} postDataList={postData}/>
    );
};

export default MyPosts;