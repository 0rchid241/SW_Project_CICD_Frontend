import React, { useEffect, useState } from "react";
import {
    Alert,
    Box, Button,
    CircularProgress,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useMyPage } from "../../../hooks/useMyPage.js";
import { isAdmin, isSuperAdmin } from "../../util/roleUtils.js";
import MyPosts from "./MyPosts.jsx";
import MyCommentsContainer from "./MyCommentsContainer.jsx";
import useUserAdminAction from "../../../hooks/useUserAdminAction.js";

const UserProfilePage = () => {
    // 로그인 정보 가져옴
    const { urlPath, userId: profileUserIdParam } = useParams();
    const { userId: loginUserId, role } = useAuth();
    const { fetchUserProfile } = useMyPage();

    const profileUserId = Number(profileUserIdParam);
    const currentUserId = Number(loginUserId);

    const { warnUser, handleGrantAdmin } = useUserAdminAction({ targetUserId: profileUserId });

    const [profile, setProfile] = useState(null);
    const [activeMenu, setActiveMenu] = useState("INFO");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 권한 판단
    const isOwner = loginUserId != null && currentUserId === profileUserId;

    const canManageUser = isAdmin(role) && !isOwner;

    const canGrantAdmin = isSuperAdmin(role) && !isOwner;

    useEffect(() => {
        const loadUserProfile = async () => {
            if ( !profileUserIdParam || Number.isNaN(profileUserId) ) {
                setErrorMessage("올바르지 않은 유저 번호입니다.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setErrorMessage("");

                const data = await fetchUserProfile(profileUserId);

                setProfile(data);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [ profileUserId, profileUserIdParam, fetchUserProfile ]);

    useEffect(() => {
        /*
         * 관리자 권한이 없거나 자기 페이지인데
         * 경고 탭이 선택된 예외 상황 방지
         */
        if ( activeMenu === "WARNING" && !canManageUser ) {
            setActiveMenu("INFO");
        }
    }, [activeMenu, canManageUser]);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleMenuChange = (menu) => {
        clearMessages();
        setActiveMenu(menu);
    };

    const handleWarnUser = async () => {
        try {
            setActionLoading(true);
            clearMessages();

            const applied = await warnUser();

            /*
             * warnUser에서 prompt를 취소하면 false를 반환하도록
             * 아래의 훅 수정도 함께 적용해야 한다.
             */
            if (applied === false) {
                return;
            }

            setSuccessMessage(`${profile?.nickname || "해당 유저"}에게 경고를 부여했습니다.`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleGrantBoardAdmin = async () => {
        const confirmed = window.confirm(`${profile?.nickname || "해당 유저"}에게 현재 게시판 관리자 권한을 부여하시겠습니까?`);

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            clearMessages();

            await handleGrantAdmin();

            setSuccessMessage(`${profile?.nickname || "해당 유저"}에게 게시판 관리자 권한을 부여했습니다.`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const renderUserInfo = () => {
        return (
            <Box>
                <Typography variant="h4" sx={{fontWeight: "bold", mb: 3}}>
                    유저 정보
                </Typography>

                <Paper elevation={0} sx={{p: 3, border: 1, borderColor: "divider", borderRadius: 3}}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                유저 번호
                            </Typography>

                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profile?.id ?? profileUserId}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                닉네임
                            </Typography>

                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profile?.nickname || "정보 없음"}
                            </Typography>
                        </Box>

                        {isOwner && (
                            <>
                                <Divider />

                                <Alert severity="info">
                                    이메일, 닉네임 변경, 비밀번호 변경은
                                    기존 마이페이지의 내 정보 메뉴에서
                                    관리할 수 있습니다.
                                </Alert>
                            </>
                        )}
                    </Stack>
                </Paper>
            </Box>
        );
    };

    const renderWarningPanel = () => {
        return (
            <Box>
                <Typography variant="h4" sx={{fontWeight: "bold", mb: 3}}>
                    경고 및 권한 관리
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

                <Paper elevation={0} sx={{p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>
                                관리 대상
                            </Typography>

                            <Stack spacing={1}>
                                <Typography>
                                    <strong>유저 번호:</strong>{" "}
                                    {profile?.id ?? profileUserId}
                                </Typography>

                                <Typography>
                                    <strong>닉네임:</strong>{" "}
                                    {profile?.nickname || "정보 없음"}
                                </Typography>

                                <Typography>
                                    <strong>현재 게시판:</strong>{" "}
                                    {urlPath || "정보 없음"}
                                </Typography>
                            </Stack>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1 }}
                            >
                                유저 경고
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                현재 게시판에서 해당 유저에게 경고를
                                부여합니다.
                            </Typography>

                            <Button
                                variant="contained"
                                color="warning"
                                disabled={actionLoading}
                                onClick={handleWarnUser}
                            >
                                {actionLoading
                                    ? "처리 중..."
                                    : "경고 부여"}
                            </Button>
                        </Box>

                        {canGrantAdmin && (
                            <>
                                <Divider />

                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 1 }}
                                    >
                                        게시판 관리자 권한
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        Super Admin만 현재 게시판의
                                        관리자 권한을 부여할 수 있습니다.
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        disabled={actionLoading}
                                        onClick={handleGrantBoardAdmin}
                                    >
                                        게시판 관리자 권한 부여
                                    </Button>
                                </Box>
                            </>
                        )}

                        {/*
                            경고 내역 조회/삭제 API가 준비되면
                            이 아래에 WarningHistory 컴포넌트를 추가한다.

                            <WarningHistory
                                userId={profileUserId}
                                boardUrlPath={urlPath}
                            />
                        */}
                    </Stack>
                </Paper>
            </Box>
        );
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "INFO":
                return renderUserInfo();

            case "POSTS":
                return (<MyPosts userId={profileUserId}/>);

            case "COMMENTS":
                return (<MyCommentsContainer userId={profileUserId} title={`${profile?.nickname || "유저"}님이 작성한 댓글`}/>);

            case "WARNING":
                return canManageUser ? renderWarningPanel() : renderUserInfo();

            default:
                return renderUserInfo();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}> <CircularProgress /> </Box>
        );
    }

    if (errorMessage && !profile) {
        return (
            <Alert severity="error" sx={{ mt: 4 }}> {errorMessage} </Alert>
        );
    }




    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{fontWeight: "bold", mb: 3}}>
                {profile?.nickname || "유저"}님의 페이지
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{border: 1, borderColor: "divider", borderRadius: 2, overflow: "hidden"}}>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={activeMenu === "INFO"}
                                    onClick={() => handleMenuChange("INFO")}
                                >
                                    <ListItemText primary="유저 정보"/>
                                </ListItemButton>
                            </ListItem>

                            <Divider />

                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={activeMenu === "POSTS"}
                                    onClick={() => handleMenuChange("POSTS")}
                                >
                                    <ListItemText primary="작성한 글"/>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={activeMenu === "COMMENTS"}
                                    onClick={() => handleMenuChange("COMMENTS")}
                                >
                                    <ListItemText primary="작성한 댓글"/>
                                </ListItemButton>
                            </ListItem>

                            {canManageUser && (
                                <>
                                    <Divider />

                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={activeMenu === "WARNING"}
                                            onClick={() => handleMenuChange("WARNING")}
                                        >
                                            <ListItemText primary="경고 및 권한 관리"/>
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    {renderContent()}
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfilePage;