import React from 'react';
import {
    Box,
    Button,
    CircularProgress,

} from "@mui/material";
import { useNavigate, useParams} from "react-router-dom";
import {useBoardPosts} from "../../hooks/useBoardPosts.js";
import PostTable from "./PostTable.jsx";

const PostListPage = () => {

    const {urlPath} = useParams()
    const navigate = useNavigate();
    const {boardInfo,postDataList,loading,errorMessage} =useBoardPosts(urlPath)


    /* 비동기 처리 중 null값 렌더링을 피하기 위해 로딩중 띄울 화면 */
    if (loading || !boardInfo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress /> {/* MUI 로딩 스피너 */}
            </Box>
        );
    }

    return (
        <>
            <PostTable defaultUrlPath={urlPath} postDataList={postDataList} boardInfo={boardInfo} errorMessage={errorMessage}/>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/board/${urlPath}/write`)} // 클릭 시 /write URL로 이동
                >글쓰기
                </Button>
            </Box>
        </>
    );
};

export default PostListPage;