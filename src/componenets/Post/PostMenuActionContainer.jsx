import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import PostMenuActionPresenter from "./PostMenuActionPresenter.jsx";
import {apiFetch} from "../util/apiFetch.js";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PostMenuActionContainer = ({postId}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const {urlPath} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const handleOpenMenu = (e)=>{
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu = ()=>{
        setAnchorEl(null);
    }

    const handlePinPost = async () => {
        if (!postId){
            console.log('postId누락')
            return;
        }
        try {
            await apiFetch(`/api/admin/community/board/${urlPath}/posts/${postId}/pin`,{
                method:"PATCH",
                body: JSON.stringify({
                    postId:postId
                })
            })
            alert(`글 고정이 성공적으로 수정되었습니다.`);
        }catch (e) {
            setErrorMessage(e.message)
        }
    }


    const handleEditPost =  () => {
        if (!postId){
            navigate(`/board/${urlPath}/edit/${postId}`)
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
                urlPath={urlPath}
                postId={postId}
                onEditPost={handleEditPost}
            />
        </>
    );
};

export default PostMenuActionContainer;