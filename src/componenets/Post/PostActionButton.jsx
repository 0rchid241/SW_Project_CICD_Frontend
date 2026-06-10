import React, {useState} from 'react';
import {usePostAction} from "../../hooks/usePostAction.js";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {Box, Button, Stack, TextField} from "@mui/material";
import {useAuth} from "../../context/AuthContext.jsx";
import {isAdmin} from "../util/roleUtils.js";

const PostActionButton = ({ urlPath, postId, isLoggedIn,authorUserId }) => {

    const {moveEditPost, deletePost,verifyPassword} = usePostAction(urlPath,postId);

    const [showInput, setShowInput] = useState(false);
    const [actionType, setActionType] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(``)

    const {userId,role} = useAuth();

    const handleAction = async (type) => {
        setErrorMessage(``); // 실행 전 기존 에러 메세지 초기화

        try {

            console.log(`authorUserId`,authorUserId);
            console.log(`userId`,userId);


            // 백엔드 DTO 기준으로 비회원 글인지 판별 (userId가 없으면 비회원 글)
            const isAnonymousPost = !authorUserId;
            const isMyPost = isLoggedIn && (userId === authorUserId);

            // 1. 내 글이거나 관리자인 경우 -> 즉시 프리패스 통과
            if (isMyPost || isAdmin(role)) {
                if (type === 'edit') moveEditPost();
                else await deletePost();
                return;
            }

            // 2. 다른 '회원'의 글인 경우 -> 권한 없음 즉시 차단 (로그인/비로그인 모두 포함)
            if (!isAnonymousPost) {
                throw new Error("회원이 작성한 글은 본인만 수정/삭제할 수 있습니다.");
            }

            // 3. '비회원' 글인 경우 -> 비밀번호 입력창 제어 로직 (로그인 유저도 여기까지 내려옴)
            if (!showInput || actionType !== type) {
                setShowInput(true);
                setActionType(type);
                return;
            }

            // 4. 비밀번호 입력 완료 시 최종 실행
            await verifyPassword(password);
            if (type === 'edit') moveEditPost(password);
            else await deletePost(password);

        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <ErrorMessage errorMessage={errorMessage} />

            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">

                {showInput && (
                    <TextField
                        label={`${actionType === 'edit' ? '수정' : '삭제'} 비밀번호`}
                        type="password"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                )}

                <Button
                    variant={actionType === 'edit' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleAction('edit')}
                >
                    수정
                </Button>
                <Button
                    variant={actionType === 'delete' ? "contained" : "outlined"}
                    color="error"
                    onClick={() => handleAction('delete')}
                >
                    삭제
                </Button>
            </Stack>
        </Box>
    );
};

export default PostActionButton;