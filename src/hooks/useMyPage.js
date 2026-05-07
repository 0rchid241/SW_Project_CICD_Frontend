import {useCallback} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";


export const useMyPage = () => {

    const fetchMyPosts = useCallback (async () => {
        const response = await apiFetch(`/api/mypage/posts`);
        return await response.json();
    }, []);

    const fetchMyComments = useCallback (async () => {
        const response = await apiFetch(`/api/mypage/comments`);
        return await response.json();
    }, []);


    return {fetchMyPosts,fetchMyComments};
}