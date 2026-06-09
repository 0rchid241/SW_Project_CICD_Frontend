import React, {useState} from 'react';
import {usePostAction} from "../../hooks/usePostAction.js";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {Box, Button, Stack, TextField} from "@mui/material";

const PostActionButton = ({ urlPath, postId, isLoggedIn }) => {

    const {moveEditPost, deletePost} = usePostAction(urlPath,postId);

    const [showInput, setShowInput] = useState(false);
    const [actionType, setActionType] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(``)

    const handleAction = async (type) => {
        setErrorMessage(``); // 실행 전 기존 에러 메세지 초기화

        try {
            // 1. 로그인 유저: 비번 묻지 않고 바로 실행
            if (isLoggedIn) {
                if (type === 'edit') moveEditPost();
                else await deletePost();
                return;
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