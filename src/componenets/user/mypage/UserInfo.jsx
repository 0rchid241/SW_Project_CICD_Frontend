import React from 'react';
import {Box, Paper, Stack, Typography} from "@mui/material";

const UserInfo = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                마이페이지
            </Typography>

            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 3, }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    내 정보
                </Typography>

                <Stack spacing={1.5}>
                    <Typography>
                        <strong>아이디:</strong> { "정보 없음"}
                    </Typography>

                    <Typography>
                        <strong>닉네임:</strong> { "정보 없음"}
                    </Typography>

                    <Typography color="text.secondary">
                        내 정보 조회 미구현.
                        로그인 시 저장한 정보만 임시로 보여줌.
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
};

export default UserInfo;