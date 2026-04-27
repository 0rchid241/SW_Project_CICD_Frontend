import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Button, Stack, TextField} from "@mui/material";

const DeleteAction = ({urlPath,postId,isLoggedIn,token}) => {

    const navigate = useNavigate();
    const [showInput, setShowInput] = useState()
    const [password, setPassword] = useState()

    /* delete api 갈기기 */
    const handleDelete = async () =>{
        const response = await fetch(`/api/community/board/${urlPath}/post/${postId}/delete`,{
            method: "POST",
            headers: {"Content-Type": "application/json",
                /* 로그인회원은 token을 헤더에 실어서 전송 */
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({password:password})
        });

        if(response.ok){
            alert("삭제완료")
            navigate(`/board/${urlPath}`)
        }else {
            alert("비밀번호가 틀렸습니다.");
        }
    }


    useEffect(() => {

    }, []);

    return (
        <Box sx={{ mt: 2 }}>
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