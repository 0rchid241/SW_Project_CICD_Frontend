import React from 'react';
import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

// 케밥 없애고 이름 표시만 하도록 변경함.
const UserItem = ({authorId,authorName}) => {
    const navigate = useNavigate();
    const { urlPath } = useParams();

    const handleAuthorClick = (event) => {
        // 상위 게시글 행의 클릭 이벤트가 실행되는 것을 방지
        event.stopPropagation();

        if (!authorId || !urlPath) {
            return;
        }

        navigate(`/board/${urlPath}/users/${authorId}`);
    };

    return (
        <div
            style={{display: "flex", justifyContent: "center", alignItems: "center",}}
        >
            {authorId ? (
                <Button variant="text" size="small" onClick={handleAuthorClick}
                    sx={{
                        minWidth: 0,
                        p: 0,
                        color: "text.primary",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >{authorName}</Button>
            ) : (
                <Typography component="span" variant="body2" color="text.primary">{authorName}</Typography>
            )}
        </div>
    );
};

export default UserItem;