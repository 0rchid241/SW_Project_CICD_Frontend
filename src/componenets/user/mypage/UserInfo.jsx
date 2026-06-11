import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { apiFetch } from "../../util/apiFetch.js";

const UserInfo = () => {
    const navigate = useNavigate();
    const { authReady, isLoggedIn, updateNickname } = useAuth();

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showNicknameForm, setShowNicknameForm] = useState(false);
    const [nicknameInput, setNicknameInput] = useState("");

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const fetchMe = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await apiFetch("/api/users/me", {
                method: "GET",
            });

            const data = await response.json();
            setMe(data);
            setNicknameInput(data.nickname || "");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authReady) return;

        if (!isLoggedIn) {
            alert("로그인이 필요한 페이지입니다.");
            navigate("/login");
            return;
        }

        fetchMe();
    }, [authReady, isLoggedIn]);

    const handleOpenNicknameForm = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setNicknameInput(me?.nickname || "");
        setShowNicknameForm(true);
    };

    const handleChangeNickname = async () => {
        const trimmedNickname = nicknameInput.trim();

        if (!trimmedNickname) {
            setErrorMessage("닉네임을 입력하세요.");
            return;
        }

        if (trimmedNickname.length < 2 || trimmedNickname.length > 30) {
            setErrorMessage("닉네임은 2자 이상 30자 이하로 입력하세요.");
            return;
        }

        try {
            setErrorMessage("");
            setSuccessMessage("");

            await apiFetch("/api/users/me/nickname", {
                method: "PATCH",
                body: JSON.stringify({
                    nickname: trimmedNickname,
                }),
            });

            setMe((prev) => ({
                ...prev,
                nickname: trimmedNickname,
            }));

            updateNickname(trimmedNickname);
            setShowNicknameForm(false);
            setSuccessMessage("닉네임이 변경되었습니다.");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleOpenPasswordForm = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setShowPasswordForm(true);
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            setErrorMessage("현재 비밀번호를 입력하세요.");
            return;
        }

        if (!newPassword) {
            setErrorMessage("새 비밀번호를 입력하세요.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("새 비밀번호는 8자 이상 입력하세요.");
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setErrorMessage("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            setErrorMessage("");
            setSuccessMessage("");

            await apiFetch("/api/users/me/password", {
                method: "PATCH",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setShowPasswordForm(false);
            setSuccessMessage("비밀번호가 변경되었습니다.");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if (!authReady || loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
                마이페이지
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    내 정보
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Stack spacing={1.5}>
                    <Typography>
                        <strong>아이디:</strong> {me?.username || "정보 없음"}
                    </Typography>

                    <Typography>
                        <strong>이메일:</strong> {me?.email || "정보 없음"}
                    </Typography>

                    <Typography>
                        <strong>닉네임:</strong> {me?.nickname || "정보 없음"}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                    <Box>
                        {!showNicknameForm ? (
                            <Button
                                variant="outlined"
                                onClick={handleOpenNicknameForm}
                            >
                                닉네임 변경
                            </Button>
                        ) : (
                            <Stack spacing={1.5}>
                                <TextField
                                    label="새 닉네임"
                                    value={nicknameInput}
                                    onChange={(event) => setNicknameInput(event.target.value)}
                                    size="small"
                                    fullWidth
                                />

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        onClick={handleChangeNickname}
                                    >
                                        저장
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowNicknameForm(false)}
                                    >
                                        취소
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Box>

                    <Box>
                        {me?.socialUser ? (
                            <Alert severity="info">
                                소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.
                            </Alert>
                        ) : !showPasswordForm ? (
                            <Button
                                variant="outlined"
                                onClick={handleOpenPasswordForm}
                            >
                                비밀번호 변경
                            </Button>
                        ) : (
                            <Stack spacing={1.5}>
                                <TextField
                                    label="현재 비밀번호"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    size="small"
                                    fullWidth
                                />

                                <TextField
                                    label="새 비밀번호"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    size="small"
                                    fullWidth
                                />

                                <TextField
                                    label="새 비밀번호 확인"
                                    type="password"
                                    value={newPasswordConfirm}
                                    onChange={(event) => setNewPasswordConfirm(event.target.value)}
                                    size="small"
                                    fullWidth
                                />

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        onClick={handleChangePassword}
                                    >
                                        변경
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowPasswordForm(false)}
                                    >
                                        취소
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default UserInfo;