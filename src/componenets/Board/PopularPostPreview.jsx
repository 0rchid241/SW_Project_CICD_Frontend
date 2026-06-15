import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../util/apiFetch.js";
import LoadingCircle from "../util/LoadingCircle.jsx";

const PopularPostPreview = () => {

    const [previewPostData, setPreviewPostData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTop5 = async ()=>{
            try {
                const response = await apiFetch("/api/community/board/popular/top5");
                const data = await response.json();
                setPreviewPostData(data);
            }catch (e) {
                console.log(`인기글 Top5 로딩 오류: ${e}`);
            }finally {
                setLoading(false);
            }
        }
        fetchTop5();
    }, []);

    if (loading) return <LoadingCircle/>;

    return (
        <div style={{ marginBottom: '40px', backgroundColor: '#2b2b2b', borderRadius: '2px', overflow: 'hidden' }}>
            {/* 헤더 */}
            <div className="dc-list-header">
                실시간 인기글 Top 5
            </div>

            {/* 리스트 본문 */}
            <div>
                {previewPostData.map((post) => (
                    <div
                        key={post.id}
                        className="dc-list-item"
                        style={{ cursor: 'pointer', color: '#dddddd', fontSize: '14px' }}
                        onClick={() => navigate(`/board/${post.urlPath}/post/${post.postId}`)}
                        onMouseOver={(e) => e.currentTarget.style.color = '#92b4ec'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#dddddd'}
                    >
                        {post.title}
                    </div>
                ))}
            </div>

            {/* 푸터 (더보기) */}
            <div className="dc-flex-end" style={{ padding: '8px 12px' }}>
                <button
                    className="dc-btn dc-btn-text"
                    style={{ fontSize: '13px' }}
                    onClick={() => navigate('/board/popular')}
                >
                    인기글 더보기 &rarr;
                </button>
            </div>
        </div>
    );
};

export default PopularPostPreview;