import React, {useEffect, useState} from 'react';
import {useMyPage} from "../../../hooks/useMyPage.js";
import PostTable from "../../Post/PostTable.jsx";

const MyPosts = ({ userId = null, title = "내가 쓴 글" }) => {

    const {fetchMyPosts, fetchUserPosts} = useMyPage();
    const [error, setError] = useState("");
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = userId
                    ? await fetchUserPosts(userId)
                    : await fetchMyPosts();
                setPostData(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, [userId, fetchMyPosts, fetchUserPosts]);


    // MUI CircularProgress 대신 일반 텍스트/디자인으로 대체
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#888' }}>
                로딩 중...
            </div>
        );
    }

    return (
        <div className="dc-write-container">
            {/* PostTable로 title 값을 넘겨줌 */}
            <PostTable title={title} errorMessage={error} postDataList={postData}/>
        </div>
    );
};

export default MyPosts;