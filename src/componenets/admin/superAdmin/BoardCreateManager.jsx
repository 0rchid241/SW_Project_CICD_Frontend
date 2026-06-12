import React, {useState} from 'react';
import {useSuperAdmin} from "../../../hooks/useSuperAdmin.js";
import {Alert, Box, Button, Stack, TextField, Typography} from "@mui/material";

const BoardCreateManager = () => {

    const {loading, createBoard, status, setStatus} = useSuperAdmin();

    const [formData, setFormData] = useState({
        name: '',
        urlPath: '',
        description: ''
    });

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData(prev => ({
            ...prev,[name]:value}));

        if (status?.message) setStatus({});
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const isSuccess = await createBoard(formData)

        if (isSuccess) {
            setFormData({ name: '', urlPath: '', description: '' });
        }
    }

    return (
        <Box sx={{width:'100%'}}>
            {/* 타이틀 영역 */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                커뮤니티 생성 관리
            </Typography>

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 4, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    새로운 커뮤니티 생성
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    시스템에 새로운 커뮤니티(게시판)를 추가합니다.
                </Typography>

                {status?.message && (
                    <Alert severity={status.type} sx={{ mb: 3 }}>
                        {status.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ maxWidth: 600 }}>
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
                        <Box>
                            {/* 버튼 크기도 적절히 조절 */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 1, minWidth: 200 }}
                            >
                                {loading ? '생성 중...' : '커뮤니티 생성하기'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default BoardCreateManager;