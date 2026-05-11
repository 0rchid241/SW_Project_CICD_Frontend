import React, {useContext, useEffect, useState} from 'react';
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";

const OAuthSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const ticket = searchParams.get("ticket");
    const [message, setMessage] = useState("로그인 처리 중입니다...");

    const {login} = useContext(AuthContext);

    useEffect(() => {
        const exchangeTicket = async () => {
            try {
                if (!ticket) {
                    setMessage("로그인 티켓이 없습니다.");
                    return;
                }

                const response = await fetch(`/api/oauth/login-ticket?ticket=${ticket}`);

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "로그인 처리에 실패했습니다.");
                }

                const data = await response.json();

                // localStorage.setItem("accessToken", data.accessToken);
                // localStorage.setItem("username", data.username);
                // localStorage.setItem("nickname", data.nickname);
                //
                // window.dispatchEvent(new Event("auth-change"));

                login(data);
                alert("로그인에 성공했습니다.");

                navigate("/");
            } catch (err) {
                console.error(err);
                setMessage(err.message || "소셜 로그인 처리 중 오류가 발생했습니다.");
            }
        };

        exchangeTicket();
    }, [ticket, navigate, login]);

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    textAlign: 'center',
                }}
            >
                <CircularProgress sx={{ mb: 3 }} />
                <Typography>{message}</Typography>
            </Paper>
        </Box>
    );
};

export default OAuthSuccessPage;