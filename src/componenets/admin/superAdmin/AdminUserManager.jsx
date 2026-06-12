import React, {useEffect, useState} from 'react';
import {useSuperAdmin} from "../../../hooks/useSuperAdmin.js";
import {
    Alert,
    Box, Button, CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import LoadingCircle from "../../util/LoadingCircle.jsx";
import ErrorMessage from "../../util/ErrorMessage.jsx";

const AdminUserManager = () => {

    const {
        adminUserList,
        loading,
        fetchAdminUsers,
        revokeAdmin
    } = useSuperAdmin();

    useEffect(() => {
        fetchAdminUsers(); // 컴포넌트 마운트 시 관리자 목록 로드
    }, [fetchAdminUsers]);

    const [errorMessage, setErrorMessage] = useState(``);
    
    const handleRevoke = async (urlPath,adminId) => {
        if (window.confirm("이 유저의 관리자 권한을 박탈하시겠습니까?")) {
            try {
                console.log(urlPath,adminId);
                await revokeAdmin(urlPath,adminId);

                await fetchAdminUsers();
                alert("권한이 성공적으로 박탈되었습니다.");
            }
            catch (e){
                setErrorMessage(e.message);
            }
        }
    };


    if (loading) return <LoadingCircle/>

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 4, bgcolor: 'background.default' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    게시판 어드민 관리
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    현재 커뮤니티를 관리 중인 어드민 목록입니다. 지정된 권한을 박탈할 수 있습니다.
                </Typography>

                {status?.message && (
                    <Alert severity={status.type} sx={{ mb: 3 }}>
                        {status.message}
                    </Alert>
                )}

                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'transparent' }}>
                    <ErrorMessage errorMessage={errorMessage}/>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                                <TableCell align="center" width="15%"><strong>유저 ID</strong></TableCell>
                                <TableCell align="center" width="25%"><strong>닉네임</strong></TableCell>
                                <TableCell align="center" width="25%"><strong>관리 게시판</strong></TableCell>
                                <TableCell align="center" width="20%"><strong>게시판 URL</strong></TableCell>
                                <TableCell align="center" width="15%"><strong>권한 관리</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminUserList && adminUserList.length > 0 ? (
                                adminUserList.map((admin) => (

                                    <TableRow key={`${admin.userId}-${admin.boardId}`} hover>
                                        <TableCell align="center">{admin.userId}</TableCell>
                                        <TableCell align="center">{admin.nickname}</TableCell>
                                        <TableCell align="center">{admin.boardName}</TableCell>
                                        <TableCell align="center">{admin.boardUrlPath}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRevoke(admin.boardUrlPath,admin.userId)}
                                            >
                                                권한 박탈
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        현재 등록된 게시판 관리자가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminUserManager;