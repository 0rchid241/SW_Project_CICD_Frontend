import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";

const PostWritePage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        authorName : '',
        password : '',
        title : '',
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

        if (!formData.title || !formData.content || !formData.authorName || !formData.password) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/community/write",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(formData)
            });if (response.ok) {
                alert("글이 성공적으로 등록되었습니다.");
                navigate('/'); // 작성 완료 후 리스트로 이동
            } else {
                alert("서버 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("글 작성하다가 오류남.:", error);
        }
    }


    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>새 글 작성</Typography>

            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
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

                    <TextField
                        label="제목"
                        name="title"
                        size="small"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                    />

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
                        <Button variant="outlined" onClick={() => navigate('/')}>취소</Button>
                        <Button variant="contained" onClick={handleSubmit}>등록</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default PostWritePage;