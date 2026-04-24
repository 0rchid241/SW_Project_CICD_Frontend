import React, {useState} from 'react';
import {Button} from "@mui/material";

const PostLikeButton = ({urlPath,postId,initialLikeCount}) => {

    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(false);


    const handleLikeClick = async ()=>{

        /* 1차적으로 방어 */
        if (isLiked) {
            alert("이미 추천하셨습니다.");
            return;
        }

        /* API 결과 받기 전에 일단 1업데이트 시키기
        * UX적으로 친화적이게 하고 나중에 새로고침 할 때 API 결과값 으로 초기화 */
        const previousCount=likeCount;
        setLikeCount(likeCount+1);
        setIsLiked(true);

        try {
            const response = await fetch(`/api/community/board/${urlPath}/post/${postId}/likes/addLike`, {
                method:"POST"
            });
            if(!response.ok){
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        }catch (error) {
            // 💡 [Step 4] 롤백(Rollback): 서버 통신 실패 시 UI를 원상 복구
            console.error("추천 실패:", error);
            alert(error.message || "추천 처리 중 네트워크 오류가 발생했습니다.");

            setLikeCount(previousCount); // 백업해둔 이전 숫자로 되돌림
            setIsLiked(false);           // 버튼 활성화 상태도 원래대로
        }

    }

    return (
        <Button
            variant={isLiked ? "contained" : "outlined"}
            color="primary"
            onClick={handleLikeClick}
            // startIcon={}
            sx={{ mt: 2, mb: 2 }}
        >
            추천 {likeCount}
        </Button>
    );
};

export default PostLikeButton;