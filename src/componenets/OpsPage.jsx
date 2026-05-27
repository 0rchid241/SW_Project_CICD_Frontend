import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {apiFetch} from "./util/apiFetch.js";


const OpsPage = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState(false);
    const [deployMessage, setDeployMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await apiFetch("/api/ops/summary");
            const data = await response.json();

            setSummary(data);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || "운영 상태 조회 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    // 배포 요청 함수
    const handleDeploy = async () => {
        const confirmed = window.confirm("서비스 서버에 무중단 배포를 요청할까요?");
        if (!confirmed) return;

        try {
            setDeploying(true);
            setDeployMessage("");
            setErrorMessage("");

            const response = await apiFetch("/api/ops/deploy", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setDeployMessage(data.message || "배포 요청이 등록되었습니다.");
            } else {
                setErrorMessage(data.message || "배포 요청에 실패했습니다.");
            }

            await fetchSummary();
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || "배포 요청 중 오류가 발생했습니다.");
        } finally {
            setDeploying(false);
        }
    };

    // 상태 UP/DOWN 쓰기
    const renderStatusChip = (status) => {
        const value = status || "-";

        if (value === "UP") {
            return <Chip label="UP" color="success" size="small" />;
        }

        if (value === "DOWN") {
            return <Chip label="DOWN" color="error" size="small" />;
        }

        return <Chip label={value} color="default" size="small" />;
    };

    // 상태 카드
    const StatusCard = ({ title, status, description }) => {
        return (
            <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography fontWeight="bold">
                                {title}
                            </Typography>

                            {renderStatusChip(status)}
                        </Stack>

                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    const serverMode = summary?.serverMode;
    const isTestServer = serverMode === "TEST";
    const isServiceServer = serverMode === "SERVICE";


    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
            <Stack spacing={3}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            운영 대시보드
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            서버 상태와 배포 상태를 확인합니다.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={fetchSummary}
                        disabled={loading}
                    >
                        새로고침
                    </Button>
                </Stack>

                {loading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={20} />
                        <Typography color="text.secondary">
                            운영 상태를 불러오는 중...
                        </Typography>
                    </Stack>
                )}

                {errorMessage && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}

                {deployMessage && (
                    <Alert severity="success">
                        {deployMessage}
                    </Alert>
                )}

                {summary && (
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                서버 모드
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                현재 서버가 테스트 서버인지 서비스 서버인지 구분합니다.
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={summary.serverMode || "UNKNOWN"}
                                            color={isServiceServer ? "primary" : "warning"}
                                        />
                                    </Stack>

                                    {isTestServer && (
                                        <Alert severity="info">
                                            테스트 서버입니다. 운영 상태만 확인할 수 있고, 무중단 배포 버튼은 표시되지 않습니다.
                                        </Alert>
                                    )}

                                    {isServiceServer && (
                                        <Alert severity="success">
                                            서비스 서버입니다. Blue/Green 상태 확인과 무중단 배포 요청이 가능합니다.
                                        </Alert>
                                    )}

                                    {!isTestServer && !isServiceServer && (
                                        <Alert severity="warning">
                                            서버 모드를 확인할 수 없습니다. 백엔드의 OPS_SERVER_MODE 설정을 확인해주세요.
                                        </Alert>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {isTestServer && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    테스트 서버 상태
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Backend"
                                            status={summary.backend}
                                            description="테스트 서버 백엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Frontend"
                                            status={summary.frontend}
                                            description="테스트 서버 프론트엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="DB"
                                            status={summary.db}
                                            description="데이터베이스"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Nginx"
                                            status={summary.nginx}
                                            description="테스트 서버 Nginx"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {isServiceServer && (
                            <Box>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                >
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            서비스 서버 상태
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Active Backend: {summary.activeBackend || "-"}
                                        </Typography>
                                    </Box>

                                    {summary.deployEnabled && (
                                        <Button
                                            variant="contained"
                                            onClick={handleDeploy}
                                            disabled={deploying}
                                        >
                                            {deploying ? "배포 요청 중..." : "무중단 배포 실행"}
                                        </Button>
                                    )}
                                </Stack>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Backend Blue"
                                            status={summary.backendBlue}
                                            description="Blue 백엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Backend Green"
                                            status={summary.backendGreen}
                                            description="Green 백엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Frontend Blue"
                                            status={summary.frontendBlue}
                                            description="Blue 프론트엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Frontend Green"
                                            status={summary.frontendGreen}
                                            description="Green 프론트엔드"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="DB"
                                            status={summary.db}
                                            description="데이터베이스"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatusCard
                                            title="Nginx"
                                            status={summary.nginx}
                                            description="서비스 서버 Nginx"
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography fontWeight="bold">
                                                마지막 배포 결과
                                            </Typography>

                                            <Typography color="text.secondary">
                                                {summary.lastDeployResult || "-"}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default OpsPage;