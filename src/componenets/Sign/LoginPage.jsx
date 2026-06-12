import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {apiFetch} from "../util/apiFetch.js";

const textFieldSx = {
    "& .MuiInputBase-input": {
        color: "#111827",
    },
    "& .MuiInputLabel-root": {
        color: "#4b5563",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#d1d5db",
        },
        "&:hover fieldset": {
            borderColor: "#9ca3af",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#111827",
        },
    },
};


const LoginPage = () => {

    const [formData, setFormData] = useState({
        username:'',
        password:''
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const [findUsernameOpen, setFindUsernameOpen] = useState(false);
    const [findUsernameEmail, setFindUsernameEmail] = useState("");
    const [findUsernameResult, setFindUsernameResult] = useState("");
    const [findUsernameLoading, setFindUsernameLoading] = useState(false);
    const [findUsernameError, setFindUsernameError] = useState("");

    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [resetPasswordForm, setResetPasswordForm] = useState({
        username: "",
        email: "",
        newPassword: "",
        newPasswordConfirm: "",
    });
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const [resetPasswordError, setResetPasswordError] = useState("");
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState("");


    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleLogin = async (event) => {
        event.preventDefault();

        if (!formData.username.trim()) {
            setErrorMessage("아이디를 입력하세요.");
            return;
        }

        if (!formData.password) {
            setErrorMessage("비밀번호를 입력하세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            /* 응답된 jwtTokenResponseDTO 로 login 진행*/
            const jwtTokenData = await response.json();
            /* 전역 Context의 로그인 함수 사용해서 로그인 */
            login(jwtTokenData);
            alert("로그인에 성공했습니다.");
            // window.dispatchEvent(new Event("auth-change"));
            navigate("/");
        } catch (e){
            setErrorMessage(e.message);
        } finally {
            setLoading(false);
        }
    };

    const openFindUsernameDialog = () => {
        setFindUsernameEmail("");
        setFindUsernameResult("");
        setFindUsernameError("");
        setFindUsernameOpen(true);
    };

    const closeFindUsernameDialog = () => {
        setFindUsernameOpen(false);
    };

    const handleFindUsername = async () => {
        const email = findUsernameEmail.trim();

        if (!email) {
            setFindUsernameError("이메일을 입력하세요.");
            return;
        }

        setFindUsernameLoading(true);
        setFindUsernameError("");
        setFindUsernameResult("");

        try {
            const response = await apiFetch("/api/auth/find-username", {
                method: "POST",
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await response.json();
            setFindUsernameResult(data.username || "아이디 정보를 찾았습니다.");
        } catch (error) {
            setFindUsernameError(error.message);
        } finally {
            setFindUsernameLoading(false);
        }
    };

    const openResetPasswordDialog = () => {
        setResetPasswordForm({
            username: "",
            email: "",
            newPassword: "",
            newPasswordConfirm: "",
        });
        setResetPasswordError("");
        setResetPasswordSuccess("");
        setResetPasswordOpen(true);
    };

    const closeResetPasswordDialog = () => {
        setResetPasswordOpen(false);
    };

    const handleResetPasswordChange = (event) => {
        const { name, value } = event.target;

        setResetPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleResetPassword = async () => {
        const username = resetPasswordForm.username.trim();
        const email = resetPasswordForm.email.trim();
        const newPassword = resetPasswordForm.newPassword;
        const newPasswordConfirm = resetPasswordForm.newPasswordConfirm;

        if (!username) {
            setResetPasswordError("아이디를 입력하세요.");
            return;
        }

        if (!email) {
            setResetPasswordError("이메일을 입력하세요.");
            return;
        }

        if (!newPassword) {
            setResetPasswordError("새 비밀번호를 입력하세요.");
            return;
        }

        if (newPassword.length < 8) {
            setResetPasswordError("새 비밀번호는 8자 이상 입력하세요.");
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setResetPasswordError("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setResetPasswordLoading(true);
        setResetPasswordError("");
        setResetPasswordSuccess("");

        try {
            await apiFetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    email,
                    newPassword,
                }),
            });

            setResetPasswordSuccess("비밀번호가 재설정되었습니다. 새 비밀번호로 로그인하세요.");
            setResetPasswordForm({
                username: "",
                email: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
        } catch (error) {
            setResetPasswordError(error.message);
        } finally {
            setResetPasswordLoading(false);
        }
    };


    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 6,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    p: 4,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 4,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    backgroundColor: "#ffffff",
                    color: "#111827",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        color: "#111827",
                    }}
                >
                    로그인
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 3,
                        color: "#6b7280",
                    }}
                >
                    계정으로 로그인하고 커뮤니티 기능을 이용해보세요.
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin}>
                    <Stack spacing={2}>
                        <TextField
                            label="아이디"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="아이디 입력"
                            fullWidth
                            sx={textFieldSx}
                        />

                        <TextField
                            label="비밀번호"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호 입력"
                            fullWidth
                            sx={textFieldSx}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 1.4,
                                borderRadius: 2,
                                backgroundColor: "#111827",
                                fontWeight: 700,
                                "&:hover": {
                                    backgroundColor: "#1f2937",
                                },
                            }}
                        >
                            {loading ? "로그인 중..." : "로그인"}
                        </Button>

                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            sx={{ pt: 0.5 }}
                        >
                            <Button
                                size="small"
                                onClick={openFindUsernameDialog}
                                sx={{ color: "#374151" }}
                            >
                                아이디 찾기
                            </Button>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#d1d5db",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                |
                            </Typography>

                            <Button
                                size="small"
                                onClick={openResetPasswordDialog}
                                sx={{ color: "#374151" }}
                            >
                                비밀번호 재설정
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 1 }}>
                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                또는
                            </Typography>
                        </Divider>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                window.location.href = "/api/oauth/google/login";
                            }}
                            sx={{
                                py: 1.2,
                                borderRadius: 2,
                                borderColor: "#d1d5db",
                                color: "#111827",
                                fontWeight: 600,
                            }}
                        >
                            Google로 계속하기
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                window.location.href = "/api/oauth/kakao/login";
                            }}
                            sx={{
                                py: 1.2,
                                borderRadius: 2,
                                borderColor: "#d1d5db",
                                color: "#111827",
                                fontWeight: 600,
                            }}
                        >
                            Kakao로 계속하기
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Dialog
                open={findUsernameOpen}
                onClose={closeFindUsernameDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    아이디 찾기
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            가입할 때 사용한 이메일을 입력하면 아이디를 확인할 수 있습니다.
                        </Typography>

                        {findUsernameError && (
                            <Alert severity="error">
                                {findUsernameError}
                            </Alert>
                        )}

                        {findUsernameResult && (
                            <Alert severity="success">
                                가입된 아이디는 <strong>{findUsernameResult}</strong> 입니다.
                            </Alert>
                        )}

                        <TextField
                            label="이메일"
                            type="email"
                            value={findUsernameEmail}
                            onChange={(event) => setFindUsernameEmail(event.target.value)}
                            placeholder="user@example.invalid"
                            fullWidth
                            sx={textFieldSx}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={closeFindUsernameDialog}>
                        닫기
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleFindUsername}
                        disabled={findUsernameLoading}
                        sx={{
                            backgroundColor: "#111827",
                            "&:hover": {
                                backgroundColor: "#1f2937",
                            },
                        }}
                    >
                        {findUsernameLoading ? "찾는 중..." : "아이디 찾기"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={resetPasswordOpen}
                onClose={closeResetPasswordDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    비밀번호 재설정
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            아이디와 이메일이 일치하면 새 비밀번호로 변경할 수 있습니다.
                        </Typography>

                        {resetPasswordError && (
                            <Alert severity="error">
                                {resetPasswordError}
                            </Alert>
                        )}

                        {resetPasswordSuccess && (
                            <Alert severity="success">
                                {resetPasswordSuccess}
                            </Alert>
                        )}

                        <TextField
                            label="아이디"
                            name="username"
                            value={resetPasswordForm.username}
                            onChange={handleResetPasswordChange}
                            fullWidth
                            sx={textFieldSx}
                        />

                        <TextField
                            label="이메일"
                            type="email"
                            name="email"
                            value={resetPasswordForm.email}
                            onChange={handleResetPasswordChange}
                            fullWidth
                            sx={textFieldSx}
                        />

                        <TextField
                            label="새 비밀번호"
                            type="password"
                            name="newPassword"
                            value={resetPasswordForm.newPassword}
                            onChange={handleResetPasswordChange}
                            fullWidth
                            sx={textFieldSx}
                        />

                        <TextField
                            label="새 비밀번호 확인"
                            type="password"
                            name="newPasswordConfirm"
                            value={resetPasswordForm.newPasswordConfirm}
                            onChange={handleResetPasswordChange}
                            fullWidth
                            sx={textFieldSx}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={closeResetPasswordDialog}>
                        닫기
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleResetPassword}
                        disabled={resetPasswordLoading}
                        sx={{
                            backgroundColor: "#111827",
                            "&:hover": {
                                backgroundColor: "#1f2937",
                            },
                        }}
                    >
                        {resetPasswordLoading ? "변경 중..." : "비밀번호 재설정"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoginPage;