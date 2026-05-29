import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Box, Button, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {apiFetch} from "../util/apiFetch.js";
import {useCategories} from "../../hooks/useCategories.js";

const PostWritePage = () => {

    const navigate = useNavigate();
    const {urlPath} = useParams();
    const { categories, categoryMessage,fetchActiveCategories } = useCategories(urlPath);
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        fetchActiveCategories();
    }, [urlPath]);

    const {isLoggedIn,token} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        authorName : '',
        password : '',
        title : '',
        categoryId: '',
        content : ''
    })

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () =>{

        /* 공통 입력값 먼저 검증*/
        if(!formData.title || !formData.content){
            setErrorMessage("제목과 내용을 입력해주세요 ")
            return;
        }
        /* 카테고리 선택 검증 */
        if (!formData.categoryId) {
            setErrorMessage("카테고리를 선택해주세요.");
            return;
        }
        /* 비로그인 상태에만 이름, 비밀번호 추가로 인증*/
        if(!isLoggedIn && ( !formData.authorName || !formData.password)){
            setErrorMessage("이름과 비밀번호를 입력해주세요.")
            return;
        }

        try {
            const requestBody = {
                ...formData,
                categoryId: Number(formData.categoryId)
            };

            await apiFetch(`/api/community/board/${urlPath}/write`, {
                method: "POST",
                body: JSON.stringify(requestBody)
            });

            /* 아무이상없으면 여기도달 */
            alert("글이 성공적으로 등록되었습니다.");
            navigate(`/board/${urlPath}`); // 작성 완료 후 리스트로 이동
        }
        /* 커스텀 fetch요청에서 던지는 error 메세지 출력
        *  ErrorResponse의 message필드 */
        catch (error){
            setErrorMessage(error.message)
        }
    }


    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>새 글 작성</Typography>

            <Paper sx={{ p: 3 }}>
                <ErrorMessage errorMessage={errorMessage || categoryMessage} />
                <Stack spacing={2}>

                    {/* 로그인 상태가 아닐 때에만 닉네임, 비밀번호 입력. */}
                    {!isLoggedIn && (
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="닉네임"
                                name="authorName"
                                size="small"
                                fullWidth
                                value={formData.authorName}
                                onChange={handleChange}
                            />
                            <TextField
                                label="비밀번호"
                                name="password"
                                type="password"
                                size="small"
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Stack>
                    )}


                    <TextField
                        label="제목"
                        name="title"
                        size="small"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        label="카테고리"
                        name="categoryId"
                        size="small"
                        fullWidth
                        value={formData.categoryId}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="본문 내용"
                        name="content"
                        multiline
                        rows={12}
                        fullWidth
                        value={formData.content}
                        onChange={handleChange}
                    />

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => navigate(`/board/${urlPath}`)}>취소</Button>
                        <Button variant="contained" onClick={handleSubmit}>등록</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default PostWritePage;