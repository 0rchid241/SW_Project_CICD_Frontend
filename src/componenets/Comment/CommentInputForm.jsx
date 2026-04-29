import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Divider, Stack, TextField, Typography} from "@mui/material";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";

const CommentInputForm = ({onSubmit,isLoggedIn}) => {


    const [commentData, setCommentData] = useState({
        authorName: "",
        password:"",
        content: ""
    })

    const handleChange = (e)=>{
        const {name,value} = e.target
        setCommentData({
            ...commentData,
            [name]:value
        });
    }

    const [errorMessage, setErrorMessage] = useState("")
    

    const handleCreateComment = async ()=>{

        if(!commentData.content){
            setErrorMessage("내용을 입력해주세요.");
            return;
        }

        if(!isLoggedIn && (!commentData.authorName || !commentData.password)){
            setErrorMessage("이름, 비밀번호를 입력해주세요");
            return;
        }

        /* 인자로 받은 댓글작성핸들러 실행 */
        const response = await onSubmit(commentData);

        /* 댓글 입력 초기화 */
        if (response && response.ok) {
            setCommentData({
                authorName: "",
                password: "",
                content: ""
            });
            setErrorMessage("")
        }else if(response){
            const errorResponse = await response.json();
            setErrorMessage(errorResponse.message);
        }
    }


    return (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>

            <ErrorMessage errorMessage={errorMessage}/>

            {!isLoggedIn && (
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        label="이름"
                        size="small"
                        name={"authorName"}
                        value={commentData.authorName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        size="small"
                        name={"password"}
                        value={commentData.password}
                        onChange={handleChange}
                    />
                </Stack>
            )}

            <TextField
                label="댓글을 남겨보세요"
                multiline
                rows={3}
                fullWidth
                name={"content"}
                value={commentData.content}
                onChange={handleChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleCreateComment}>
                    등록
                </Button>
            </Box>
        </Box>
    );
};

export default CommentInputForm;