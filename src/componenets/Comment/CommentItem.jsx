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
        <Box sx={{ ml: isChild ? 4 : 0, mt: 2, mb: 2, p: 2, bgcolor: isChild ? 'background.paper' : 'transparent', borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                {/* 회원인지 비회원인지 확인 후 회원일 경우에만 클릭 가능하도록 함 */}
                {comment.userId ? (
                    <Button variant="text" size="small" onClick={handleAuthorClick}
                        sx={{
                            minWidth: 0,
                            p: 0,
                            color: "text.primary",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        {comment.authorName}
                    </Button>
                ) : (
                    <Typography fontWeight="bold">
                        {comment.authorName}
                    </Typography>
                )}
            </Stack>

            {/* 💡 수정 모드일 때와 아닐 때 렌더링 분기 */}
            {isEditing ? (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        multiline
                        fullWidth
                        size="small"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                        <Button size="small" onClick={() => setIsEditing(false)}>취소</Button>
                        <Button size="small" variant="contained" onClick={handleUpdateSubmit}>저장</Button>
                    </Stack>
                </Box>
            ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                    {comment.mentionedName && (
                        <Typography variant="body2" component="span" sx={{ color: '#1976d2', fontWeight: 'bold', mr: 0.5 }}>
                            @{comment.mentionedName}
                        </Typography>
                    )}
                    {comment.content}
                </Typography>
            )}

            {/* 버튼 그룹 (수정 중일 때는 숨김) */}
            {!isEditing && (
                <Stack direction="row" spacing={2}>
                    <Button size="small" color="inherit" sx={{ opacity: 0.7 }} onClick={() => {
                        setIsReplying(!isReplying);
                        setShowInput(false);
                    }}>
                        {isReplying ? '취소' : '답글 달기'}
                    </Button>
                    <Button size="small" color="primary" sx={{ opacity: 0.7 }} onClick={() => handleAction('edit')}>
                        수정
                    </Button>
                    <Button size="small" color="error" sx={{ opacity: 0.7 }} onClick={() => handleAction('delete')}>
                        삭제
                    </Button>
                </Stack>
            )}

            <ErrorMessage errorMessage={errorMessage} />

            {/* 비밀번호 입력 UI 통합 */}
            {showInput && !isEditing && (
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label={`${actionType === 'edit' ? '수정' : '삭제'} 비밀번호`}
                            type="password"
                            size="small"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            color={actionType === 'edit' ? "primary" : "error"}
                            onClick={() => handleAction(actionType)}
                        >
                            확인
                        </Button>
                    </Stack>
                </Box>
            )}

            {/* 답글 창 */}
            {isReplying && !isEditing && (
                <Box sx={{ mt: 2 }}>
                    <CommentInputForm onSubmit={async (data) => {
                        await onAddReply({ ...data, parentId: comment.id });
                        setIsReplying(false);
                    }} isLoggedIn={isLoggedIn} />
                </Box>
            )}

            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default CommentItem;