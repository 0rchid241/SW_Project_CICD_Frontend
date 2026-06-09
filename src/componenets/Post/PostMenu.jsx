import React, {useState} from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {usePinPosts} from "../../hooks/usePinPosts.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {isAdmin} from "../util/roleUtils.js";
import {IconButton, Menu, MenuItem} from "@mui/material";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PostMenu = ({postId}) => {
    const { urlPath } = useParams();
    const { role } = useAuth();
    const {loading, pinnedMessage:errorMessage, togglePinPost} = usePinPosts();

    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);


    const handlePinPost = async () => {
        const result = await togglePinPost(postId);
        if(result){
            alert("글 고정 상태가 성공적으로 변경되었습니다.");
        }
        handleCloseMenu();
    }


    // 권한이 없으면 렌더링 자체를 하지 않음 (UI 최적화)
    if (!isAdmin(role)) {
        return null;
    }


    return (
        <>
            <ErrorMessage errorMessage={errorMessage} />

            <IconButton onClick={handleOpenMenu} size="small">
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handlePinPost}>
                    글 상단 고정/해제
                </MenuItem>
            </Menu>
        </>
    );
};

export default PostMenu;