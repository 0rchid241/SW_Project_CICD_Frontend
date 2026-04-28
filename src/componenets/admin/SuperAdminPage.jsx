import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/AuthContext.jsx";
import {Alert, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";

const SuperAdminPage = () => {

    const {token} = useContext(AuthContext);

    const [status, setStatus] = useState({})
    const [formData, setFormData] = useState({
        name: '',
        urlPath: '',
        description: ''
    });

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData(prev => ({
            ...prev,[name]:value}));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        // 1. 프론트엔드 1차 유효성 검사 (UX 향상)
        if (formData.name.length < 2) {
            setStatus({ type: 'error', message: '커뮤니티 이름은 2자 이상이어야 합니다.' });
            return;
        }

        const urlRegex = /^[a-z0-9]+$/;
        if (!urlRegex.test(formData.urlPath)) {
            setStatus({ type: 'error', message: 'URL 경로는 영문 소문자와 숫자만 사용할 수 있습니다.' });
            return;
        }
        try {
            const response = await fetch('/api/admin/super/create/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // AuthContext에서 가져온 토큰을 헤더에 삽입!
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus({ type: 'success', message: `[${formData.name}] 커뮤니티가 성공적으로 생성되었습니다!` });
                // 폼 초기화
                setFormData({ name: '', urlPath: '', description: '' });
            } else {
                // 🚨 지금은 백엔드에서 에러가 길게 오거나 String으로 오겠지만,
                // 나중에 전역 예외 처리기를 만들면 이 부분을 아주 예쁜 JSON으로 받을 수 있습니다!
                const errorData = await response.text();
                setStatus({ type: 'error', message: errorData || "생성에 실패했습니다." });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: '서버와 통신 중 오류가 발생했습니다.' });
        }
    
    }

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    ⚙️ 전체 관리자 (SUPER_ADMIN)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    새로운 커뮤니티(게시판)를 생성합니다.
                </Typography>

                {/* 상태 알림창 (성공 or 에러) */}
                {status.message && (
                    <Alert severity={status.type} sx={{ mb: 3 }}>
                        {status.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="커뮤니티 이름 (화면 표시용)"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ex) 피파 온라인 갤러리"
                            required
                            fullWidth
                        />
                        <TextField
                            label="URL 경로 (영어 소문자/숫자만)"
                            name="urlPath"
                            value={formData.urlPath}
                            onChange={handleChange}
                            placeholder="ex) fifa"
                            required
                            fullWidth
                            // 사용자가 대문자를 입력해도 소문자로 안내하는 UX 팁
                            helperText="실제 접속 주소가 됩니다. ( /board/입력값 )"
                        />
                        <TextField
                            label="커뮤니티 설명 (선택)"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="이 커뮤니티의 주제를 짧게 설명해주세요."
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                        >
                            커뮤니티 생성하기
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default SuperAdminPage;