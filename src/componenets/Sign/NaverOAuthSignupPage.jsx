import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Avatar } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

const NaverOAuthSignupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const ticket = searchParams.get("ticket");

    const [naverInfo, setNaverInfo] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNaverInfo = async () => {
            try {
                if (!ticket) {
                    setMessage("회원가입 티켓이 없습니다.");
                    return;
                }

                const response = await fetch(`/api/oauth/naver/signup-info?ticket=${ticket}`);

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "네이버 회원가입 정보를 불러오지 못했습니다.");
                }

                const data = await response.json();
                setNaverInfo(data);

                if (data.name) {
                    setNickname(data.name);
                }
            } catch (err) {
                console.error(err);
                setMessage(err.message || "네이버 회원가입 정보 조회 중 오류가 발생했습니다.");
            }
        };

        fetchNaverInfo();
    }, [ticket]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch("/api/oauth/naver/signup/complete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket,
                    username,
                    email,
                    nickname,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "네이버 회원가입에 실패했습니다.");
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("username", data.username);
            localStorage.setItem("nickname", data.nickname);

            window.dispatchEvent(new Event("auth-change"));

            navigate("/");
        } catch (err) {
            console.error(err);
            setMessage(err.message || "네이버 회원가입 중 오류가 발생했습니다.");
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
                    네이버 회원가입
                </Typography>

                {naverInfo && (
                    <Stack direction="row"
                           spacing={2}
                           alignItems="center"
                           sx={{ mb: 3 }}
                    >
                        {naverInfo.pictureUrl && (
                            <Avatar src={naverInfo.pictureUrl} />
                        )}

                        <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                네이버 계정 인증 완료
                            </Typography>
                            <Typography color="text.secondary">
                                추가 회원정보를 입력해주세요.
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

                        <TextField label="이메일"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   placeholder="계정 복구에 사용할 이메일"
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

export default NaverOAuthSignupPage;