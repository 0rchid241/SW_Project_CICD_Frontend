import React, {useState} from 'react';
import {usePostAction} from "../../hooks/usePostAction.js";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {Box, Button, Stack, TextField} from "@mui/material";
import {useAuth} from "../../context/AuthContext.jsx";
import {isAdmin} from "../util/roleUtils.js";

const PostActionButton = ({ urlPath, postId, isLoggedIn,authorUserId }) => {

    const {moveEditPost, deletePost} = usePostAction(urlPath,postId);

    const [showInput, setShowInput] = useState(false);
    const [actionType, setActionType] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(``)

    const {userId,role} = useAuth();

    const handleAction = async (type) => {
        setErrorMessage(``); // 실행 전 기존 에러 메세지 초기화

        try {
            // 1. 로그인 유저인 경우 (이 안에서 무조건 결판을 냄)
            if (isLoggedIn) {
                console.log(authorUserId)
                console.log(userId)
                const isMyPost = userId === authorUserId;

                // 내 글이거나 관리자인 경우 -> 프리패스 통과
                if (isMyPost || isAdmin(role)) {
                    if (type === 'edit') moveEditPost();
                    else await deletePost();
                    return;
                }
                throw new Error("본인이 작성한 글만 수정/삭제할 수 있습니다.");
            }

            // 2. 비로그인 유저 입력창 제어 로직
            if (!showInput || actionType !== type) {
                setShowInput(true);
                setActionType(type);
                return;
            }

            // 3. 비로그인 유저 최종 실행
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

                {!isLoggedIn && showInput && (
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