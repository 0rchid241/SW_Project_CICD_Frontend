import React, {useEffect, useState} from 'react';
import {apiFetch} from "../util/apiFetch.js";
import LoadingCircle from "../util/LoadingCircle.jsx";
import PopularPostItem from "./PopularPostItem.jsx";

const PopularPostListPage = () => {

    const [loading, setLoading] = useState(true);
    const [postDataList, setPostDataList] = useState([])

    useEffect(() => {
        const fetchPopularPostData = async () => {
            try {
                const response = await apiFetch('/api/community/board/popular/realtime-popular');
                const data = await response.json();
                setPostDataList(data);
                setLoading(false)
            } catch (e) {
                console.log(`인기글 불러오다가 오류 발생. ${e} `);
            }
        }
        fetchPopularPostData();

        const intervalId = setInterval(fetchPopularPostData, 10000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <div className="dc-write-container">
            <h2 className="dc-title-sub mb-3">실시간 인기 게시글 </h2>

            <div className="dc-table-container">
                <table className="dc-table">
                    <thead>
                    <tr>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>조회수</th>
                        <th>작성일</th>
                        <th>점수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {postDataList && postDataList.length > 0 ? (
                        postDataList.map((post) => (
                            <PopularPostItem key={post.postId} data={post}/>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '40px', color: '#888888' }}>
                                등록된 인기 게시글이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PopularPostListPage;