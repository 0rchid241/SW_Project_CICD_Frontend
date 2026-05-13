import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import PostMenuActionPresenter from "./PostMenuActionPresenter.jsx";
import {apiFetch} from "../util/apiFetch.js";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PostMenuActionContainer = ({postData}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const {urlPath} = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpenMenu = (e)=>{
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu = ()=>{
        setAnchorEl(null);
    }

    const handlePinPost = async () => {
        try {
            await apiFetch(`/api/community/board/${urlPath}/posts/${postData.postId}/pin`,{
                method:"PATCH",
                body: JSON.stringify({
                    postId:postData.postId
                })
            })
            if (postData.isPinned)
                alert(`글이 성공적으로 고정되었습니다.`);
            else
                alert(`글이 성공적으로 고정 해제되었습니다.`);
        }catch (e) {
            setErrorMessage(e.message)
        }
    }

    return (
        <>
            <ErrorMessage errorMessage={errorMessage} />
            <PostMenuActionPresenter
                anchorElement={anchorEl}
                onOpenMenu={handleOpenMenu}
                onCloseMenu={handleCloseMenu}
                onPinPost={handlePinPost}
            />
        </>
    );
};

export default PostMenuActionContainer;