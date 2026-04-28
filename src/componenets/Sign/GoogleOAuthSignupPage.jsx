import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Avatar } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleOAuthSignupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const ticket = searchParams.get("ticket");

    const [googleInfo, setGoogleInfo] = useState(null);
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGoogleInfo = async () => {
            try {
                if (!ticket) {
                    setMessage("회원가입 티켓이 없습니다.");
                    return;
                }

                const response = await fetch(`/api/oauth/google/signup-info?ticket=${ticket}`);

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "구글 회원가입 정보를 불러오지 못했습니다.");
                }

                const data = await response.json();
                setGoogleInfo(data);

                if (data.name) {
                    setNickname(data.name);
                }
            } catch (err) {
                console.error(err);
                setMessage(err.message || "구글 회원가입 정보 조회 중 오류가 발생했습니다.");
            }
        };

        fetchGoogleInfo();
    }, [ticket]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch("/api/oauth/google/signup/complete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket,
                    username,
                    nickname,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "구글 회원가입에 실패했습니다.");
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("username", data.username);
            localStorage.setItem("nickname", data.nickname);

            window.dispatchEvent(new Event("auth-change"));

            navigate("/");
        } catch (err) {
            console.error(err);
            setMessage(err.message || "구글 회원가입 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                    구글 회원가입
                </Typography>

                {googleInfo && (
                    <Stack direction="row"
                           spacing={2}
                           alignItems="center"
                           sx={{ mb: 3 }}
                    >
                        {googleInfo.pictureUrl && (
                            <Avatar src={googleInfo.pictureUrl} />
                        )}

                        <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                {googleInfo.name || "구글 사용자"}
                            </Typography>
                            <Typography color="text.secondary">
                                {googleInfo.email}
                            </Typography>
                        </Box>
                    </Stack>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="아이디"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                                   placeholder="로그인에 사용할 아이디"
                                   fullWidth
                        />

                        <TextField label="닉네임"
                                   value={nickname}
                                   onChange={(e) => setNickname(e.target.value)}
                                   placeholder="게시판에서 사용할 닉네임"
                                   fullWidth
                        />

                        <Button type="submit"
                                variant="contained"
                                disabled={loading}
                                fullWidth
                        >
                            {loading ? "가입 중..." : "가입 완료"}
                        </Button>
                    </Stack>
                </form>

                {message && (
                    <Typography sx={{ mt: 2 }} color="error">
                        {message}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default GoogleOAuthSignupPage;