import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Button, Stack, TextField} from "@mui/material";
import {apiFetch} from "../../util/apiFetch.js";
import ErrorMessage from "../../util/ErrorMessage.jsx";

const DeleteAction = ({urlPath,postId,isLoggedIn}) => {

    const navigate = useNavigate();
    const [showInput, setShowInput] = useState()
    const [password, setPassword] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    
    
    /* delete api 갈기기 */
    const handleDelete = async () =>{
        try {
            await apiFetch(`/api/community/board/${urlPath}/post/${postId}/delete`, {
                method: "POST",
                body: JSON.stringify({password: password})
            });
            alert("삭제완료")
            navigate(`/board/${urlPath}`);
        }
        catch (e){
            setErrorMessage(e.message);
        }
    }

    useEffect(() => {

    }, []);

    return (
        <Box sx={{ mt: 2 }}>
            <ErrorMessage errorMessage={errorMessage}/>

            <Stack direction="row" spacing={1} justifyContent="flex-end">

                {/* 익명 글일 때만 비밀번호 입력창 노출 */}
                {!isLoggedIn && showInput && (
                    <TextField
                        label="비밀번호"
                        type="password"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                )}

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        if (!isLoggedIn && !showInput) setShowInput(true);
                        else handleDelete();
                    }}
                >
                    삭제
                </Button>
            </Stack>
        </Box>
    );
};

export default DeleteAction;