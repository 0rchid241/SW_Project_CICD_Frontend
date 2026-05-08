import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, CircularProgress, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {apiFetch} from "../util/apiFetch.js";
import LoadingCircle from "../util/LoadingCircle.jsx";


const PopularPostPreview = () => {

    const [previewPostData, setPreviewPostData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTop5 = async ()=>{
            try {
                const response = await apiFetch("/api/community/board/popular/top5");
                const data = await response.json();
                setPreviewPostData(data);
            }catch (e) {
                console.log(`인기글 Top5 로딩 오류: ${e}`);
            }finally {
                setLoading(false);
            }
        }
        fetchTop5();
    }, []);


    if (loading) return <LoadingCircle/>;
    
    return (
        <Box sx={{ mb: 5, p: 2,bgcolor: "grey", borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    실시간 인기글 Top 5
                </Typography>
            </Box>
            <List dense>
                {previewPostData.map((post) => (
                    <ListItem disablePadding key={post.id}>

                        <ListItemButton onClick={() => navigate(`/board/${post.boardUrlPath}/post/${post.id}`)}>
                            <ListItemText
                                primary={post.title}
                                secondary={`추천 ${post.likeCount} | ${post.createdAt}`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ textAlign: 'right' }}>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => navigate('/board/popular')}
                >
                    인기글 더보기 &rarr;
                </Typography>
            </Box>
        </Box>
    );
};

export default PopularPostPreview;