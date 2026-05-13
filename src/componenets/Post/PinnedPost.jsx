import React from 'react';
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PinnedPost = ({defaultUrlPath,
                        pinnedPosts = [],
                        errorMessage}) => {

    const navigate = useNavigate();

    if (pinnedPosts.length === 0 && !errorMessage) {
        return null;
    }

    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <ErrorMessage errorMessage={errorMessage}/>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>📌 공지</Typography>

            {pinnedPosts.map((post) => (
                <Box
                    key={`pinned-${post.id}`}
                    sx={{
                        py:1,
                        cursor: "pointer",
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                    onClick={() => navigate(`/board/${defaultUrlPath}/posts/${post.id}`)}
                >
                    <Typography sx={{ fontWeight: "bold" }}>[공지] {post.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{post.authorName} • {post.createAt}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default PinnedPost;