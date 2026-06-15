import React, {useState} from 'react';
import {Box, Button, Divider, Stack, TextField, Typography} from "@mui/material";
import CommentInputForm from "./CommentInputForm.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {isAdmin} from "../util/roleUtils.js";
import { useNavigate, useParams } from "react-router-dom";

const CommentItem = ({comment,isChild,onAddReply,onDelete,onUpdate,onVerifyPassword}) => {


    // UI 토글 상태
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);


// 통합 권한 제어 상태
    const [showInput, setShowInput] = useState(false);
    const [actionType, setActionType] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { isLoggedIn, userId, role } = useAuth();

    const navigate = useNavigate();
    const { urlPath } = useParams();

    const handleAuthorClick = (event) => {
        event.stopPropagation();

        // 비회원 댓글은 userId가 없으므로 유저 페이지로 이동하지 않음
        if (!comment.userId) {
            return;
        }

        navigate(`/board/${urlPath}/users/${comment.userId}`);
    };


    const handleAction = async (type) => {
        setErrorMessage("");

        try {
            const isAnonymousComment = !comment.userId;
            const isMyComment = isLoggedIn && (userId === comment.userId);

            // 1. 내 댓글이거나 관리자인 경우 -> 즉시 패스
            if (isMyComment || isAdmin(role)) {
                if (type === 'edit') {
                    setIsEditing(true);
                    setIsReplying(false);
                    setShowInput(false);
                } else {
                    if (window.confirm("정말 삭제하시겠습니까?")) await onDelete(comment.id);
                }
                return;
            }

            // 2. 다른 회원의 댓글인 경우 -> 차단
            if (!isAnonymousComment) {
                throw new Error("회원이 작성한 댓글은 본인만 수정/삭제할 수 있습니다.");
            }

            // 3. 비회원 댓글 -> 비밀번호 입력창 열기
            if (!showInput || actionType !== type) {
                setShowInput(true);
                setActionType(type);
                setIsReplying(false);
                return;
            }

            if (!password.trim()) throw new Error("비밀번호를 입력해주세요.");

            // 4. 비밀번호 입력 완료 후 최종 실행
            if (type === 'edit') {
                await onVerifyPassword(comment.id, password); // 사전 검증
                setIsEditing(true); // 통과하면 수정 모드 진입
                setShowInput(false);
            } else {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                    await onDelete(comment.id, password);
                    setShowInput(false);
                    setPassword("");
                }
            }
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    // 수정 완료 핸들러
    const handleUpdateSubmit = async () => {
        if (!editContent.trim()) {
            setErrorMessage("수정할 내용을 입력해주세요.");
            return;
        }
        try {
            await onUpdate(comment.id, { content: editContent, password: password });
            setIsEditing(false);
            setPassword("");
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    return (
        <>
            <div className="dc-flex-row dc-list-item" style={{ backgroundColor: isChild ? '#1a1a1a' : 'transparent', paddingLeft: isChild ? '32px' : '12px' }}>

                {/* 1. 작성자 */}
                <div className="dc-col-author">
                    {isChild && <span style={{ color: '#555555', marginRight: '6px' }}>ㄴ</span>}
                    {comment.userId ? (
                        <button className="dc-btn dc-btn-text" style={{ fontSize: '15px', padding: 0, fontWeight: 'bold' }} onClick={handleAuthorClick}>
                            {comment.authorName}
                        </button>
                    ) : (
                        <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{comment.authorName}</span>
                    )}
                </div>

                {/* 2. 내용 */}
                <div className="dc-col-content" style={{ fontSize: '15px' }}>
                    {isEditing ? (
                        <div className="dc-flex-row gap-1" style={{ width: '100%' }}>
                            <input
                                type="text"
                                className="dc-input-box"
                                style={{ padding: '6px 8px', fontSize: '15px', flexGrow: 1 }}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <button className="dc-btn dc-btn-sm dc-btn-dark" onClick={() => setIsEditing(false)}>취소</button>
                            <button className="dc-btn dc-btn-sm dc-btn-primary" onClick={handleUpdateSubmit}>저장</button>
                        </div>
                    ) : (
                        <>
                            {comment.mentionedName && (
                                <span style={{ color: '#92b4ec', fontWeight: 'bold', marginRight: '6px' }}>
                    @{comment.mentionedName}
                </span>
                            )}
                            {comment.content}
                        </>
                    )}
                </div>


                {/* 3. 날짜 및 버튼 */}
                <div className="dc-col-info dc-flex-row gap-1">
                    <span>{comment.createAt ? comment.createAt.substring(5, 16).replace('T', ' ') : ''}</span>

                    {!isEditing && (
                        <>
                            <button className="dc-btn dc-btn-text" style={{ fontSize: '13px', padding: '2px 4px' }} onClick={() => { setIsReplying(!isReplying); setShowInput(false); }}>
                                답글
                            </button>
                            <button className="dc-btn dc-btn-text" style={{ fontSize: '13px', padding: '2px 4px' }} onClick={() => handleAction('edit')}>
                                수정
                            </button>
                            <button className="dc-btn dc-btn-text" style={{ fontSize: '13px', padding: '2px 4px', color: '#ff4d4f' }} onClick={() => handleAction('delete')}>
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 비밀번호 폼 및 답글 폼 */}
            {(errorMessage || showInput || isReplying) && (
                <div style={{ padding: '8px 12px 12px 32px', borderBottom: '1px solid #333333' }}>
                    <ErrorMessage errorMessage={errorMessage} />

                    {showInput && !isEditing && (
                        <div className="dc-flex-row gap-1 mt-2">
                            <input
                                type="password"
                                className="dc-input-box"
                                style={{ width: '150px', padding: '6px 8px' }}
                                placeholder={`${actionType === 'edit' ? '수정' : '삭제'} 비밀번호`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAction(actionType)}
                                autoFocus
                            />
                            <button className={`dc-btn dc-btn-sm ${actionType === 'edit' ? 'dc-btn-primary' : 'dc-btn-danger'}`} onClick={() => handleAction(actionType)}>
                                확인
                            </button>
                        </div>
                    )}

                    {isReplying && !isEditing && (
                        <div className="mt-2">
                            <CommentInputForm
                                onSubmit={async (data) => {
                                    await onAddReply({ ...data, parentId: comment.id });
                                    setIsReplying(false);
                                }}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CommentItem;