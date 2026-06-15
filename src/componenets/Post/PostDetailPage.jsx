import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import CommentSection from "../Comment/CommentSection.jsx";
import PostLikeButton from "./PostLikeButton.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {apiFetch} from "../util/apiFetch.js";
import PostMenu from "./PostMenu.jsx";
import PostActionButton from "./PostActionButton.jsx";
import {formatDetailDate} from "../util/dateFormater.js";

const PostDetailPage = () => {

    const {postId, urlPath} = useParams();
    const [postData, setPostData] = useState(null)

    const {isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await apiFetch(`/api/community/board/${urlPath}/post/${postId}`)
                const data = await response.json();
                setPostData(data);
            } catch (error) {
                console.error("API 호출 중 에러 발생:", error.message);
            }
        };
        getPost();

    }, [postId, urlPath]);


    if (!postData) {
        return <div style={{ color: 'white', padding: '20px' }}>데이터 로딩 중...</div>;
    }

    return (
        <div className="mt-2">

            {/* 헤더 전체 컨테이너 (세로 배치) */}
            <div style={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid #333333', padding: '16px 12px' }}>

                {/* 1. 제목 영역 (굵고 크게, 아래 여백) */}
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '0 0 12px 0' }}>
                    {postData.title}
                </h2>

                {/* 2. 작성자 및 조회수 정보 행 (가로 배치) */}
                <div className="dc-flex-between" style={{ fontSize: '13px', color: '#cccccc' }}>

                    {/* 좌측 정보 (작성자, 작성일) */}
                    <div className="dc-flex-row">
                        <span className="dc-post-info-item">
                            {postData.userId ? (
                                <button
                                    className="dc-btn dc-btn-text"
                                    style={{ padding: 0, fontWeight: 'bold' }} // 작성자 이름 살짝 강조
                                    onClick={() => navigate(`/board/${urlPath}/users/${postData.userId}`)}
                                >
                                    {postData.authorName}
                                </button>
                            ) : (
                                <span style={{ fontWeight: 'bold' }}>{postData.authorName}</span>
                            )}
                        </span>
                        <span className="dc-post-info-item">
                            {formatDetailDate(postData.createAt)}
                        </span>
                    </div>

                    {/* 우측 정보 (조회수, 추천, 댓글) */}
                    <div className="dc-flex-row">
                        <span className="dc-post-info-item">조회 {postData.viewCount ?? 0}</span>
                        <span className="dc-post-info-item">
                            추천 {postData.likeCount ?? 0}
                        </span>
                        <span className="dc-post-info-item">
                            댓글 {postData.commentCount ??0}
                        </span>
                        <PostMenu postId={postId} />
                    </div>
                </div>
            </div>

            {/* 본 글 내용 */}
            <div className="dc-post-content mb-3">
                {postData.content}
            </div>

            {/* 추천수 버튼 (가운데 정렬) */}
            <div className="dc-flex-row mb-3" style={{ justifyContent: 'center' }}>
                <PostLikeButton
                    urlPath={urlPath}
                    postId={postId}
                    initialLikeCount={postData.likeCount}
                />
            </div>

            {/* 수정/삭제 버튼 (우측 정렬) */}
            <div className="dc-flex-end mb-3">
                <PostActionButton
                    postId={postId}
                    urlPath={urlPath}
                    isLoggedIn={isLoggedIn}
                    authorUserId={postData.userId}
                />
            </div>

            {/* 댓글 컴포넌트 */}
            <CommentSection urlPath={urlPath} postId={postId} />

        </div>
    );
};

export default PostDetailPage;