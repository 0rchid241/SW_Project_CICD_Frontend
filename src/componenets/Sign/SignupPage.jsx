import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../util/apiFetch.js";

const SignupPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        nickname: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignup = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            await apiFetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            alert("회원가입 성공");
            navigate("/login");
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setLoading(false);
        }
    };

    const textFieldSx = {
        "& .MuiInputBase-input": {
            color: "#111827",
        },
        "& .MuiInputLabel-root": {
            color: "#374151",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#111827",
        },
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            "& fieldset": {
                borderColor: "#ccc",
            },
            "&:hover fieldset": {
                borderColor: "#999",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#111827",
            },
        },
        "& .MuiInputBase-input::placeholder": {
            color: "#6b7280",
            opacity: 1,
        },
    };

    return (
        <Box
            sx={{
                maxWidth: "420px",
                margin: "60px auto",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    color: "#111827",
                }}
            >
                <Stack spacing={2}>
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            marginBottom: "8px",
                            fontWeight: "bold",
                            color: "#111827",
                        }}
                    >
                        회원가입
                    </Typography>

                    <TextField
                        label="아이디"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="로그인에 사용할 아이디"
                        fullWidth
                        sx={textFieldSx}
                    />

                    <TextField
                        label="이메일"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@example.invalid"
                        fullWidth
                        sx={textFieldSx}
                    />

                    <TextField
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="8자 이상 입력"
                        fullWidth
                        sx={textFieldSx}
                    />

                    <TextField
                        label="닉네임"
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="닉네임 입력"
                        fullWidth
                    />

                    <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        onClick={handleSignup}
                        disabled={loading}
                        sx={{
                            padding: "12px",
                            borderRadius: "10px",
                            backgroundColor: "#111827",
                            color: "#ffffff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#1f2937",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "#9ca3af",
                                color: "#ffffff",
                            },
                        }}
                    >
                        {loading ? "가입 중..." : "회원가입"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default SignupPage;