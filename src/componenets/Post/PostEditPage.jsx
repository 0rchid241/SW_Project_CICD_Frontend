import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Box, Button, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {apiFetch} from "../util/apiFetch.js";
import {useCategories} from "../../hooks/useCategories.js";
import {usePostAction} from "../../hooks/usePostAction.js";

const PostEditPage = () => {
    const navigate = useNavigate();
    const { urlPath, postId } = useParams(); // URL에서 postId 추출
    const { categories, categoryMessage, fetchActiveCategories } = useCategories(urlPath);
    const [errorMessage, setErrorMessage] = useState("");
    const { isLoggedIn } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        password: '' // 비회원 수정 권한 확인용
    });

    useEffect(() => {
        /* 기존 글 정보 불러오기 */
        const fetchPostData = async () => {
            try {
                // 백엔드 GET API 경로에 맞게 수정 필요
                const response = await apiFetch(`/api/community/board/${urlPath}/post/${postId}`);
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    title: data.title,
                    content: data.content,
                    categoryId: data.categoryId || ''
                }));
            } catch (e) {
                setErrorMessage(e.message);
            }
        };

        fetchActiveCategories();
        fetchPostData();
    }, [urlPath, postId]);

    const {editPost} = usePostAction(urlPath,postId);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            setErrorMessage("제목과 내용을 입력해주세요.");
            return;
        }

        if (!isLoggedIn && !formData.password) {
            setErrorMessage("글을 수정하려면 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const requestBody = {
                title: formData.title,
                content: formData.content,
                password: formData.password
            };

            await editPost(requestBody);

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>글 수정</Typography>

            <Paper sx={{ p: 3 }}>
                <ErrorMessage errorMessage={errorMessage || categoryMessage} />
                <Stack spacing={2}>
                    {/* 비로그인 상태일 때만 비밀번호 입력 (수정 권한 확인용) */}
                    {!isLoggedIn && (
                        <TextField
                            label="비밀번호"
                            name="password"
                            type="password"
                            size="small"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            helperText="글 작성 시 입력한 비밀번호를 입력해주세요."
                        />
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
                        <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
                        <Button variant="contained" onClick={handleSubmit}>수정</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default PostEditPage;