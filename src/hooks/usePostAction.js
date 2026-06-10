import {useNavigate} from "react-router-dom";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const usePostAction = (urlPath,postId) => {

    const navigate = useNavigate();

    /* 글 수정 페이지로 이동 */
    const moveEditPost =  (password="") => {
        if (postId){
            navigate(`/board/${urlPath}/edit/${postId}`,{ state: { password } })
        }
    }

    /* delete api 갈기기 */
    const deletePost = async (password = "") => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return false;
        await apiFetch(`/api/community/board/${urlPath}/post/${postId}/delete`, {
            method: "POST",
            body: JSON.stringify({password: password})
        });
        alert("삭제완료")
        navigate(`/board/${urlPath}`);
    }


    /* 비밀번호 체크 */
    const verifyPassword = async (password="") => {
        await apiFetch(`/api/community/board/${urlPath}/post/${postId}/verify-password`, {
            method: "POST",
            body: JSON.stringify({ password: password })
        });
    }

    /* 수정 api 날리기 */
    const editPost = async (requestBody) => {
        await apiFetch(`/api/community/board/${urlPath}/post/${postId}`, {
            method: "PUT",
            body: JSON.stringify(requestBody)
        });
        alert("수정완료")
        navigate(`/board/${urlPath}/post/${postId}`); // 수정 후 해당 글 상세로 이동
    }






    return {
        moveEditPost,
        editPost,
        deletePost,
        verifyPassword
    };
}