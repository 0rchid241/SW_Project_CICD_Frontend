import React, {useEffect, useState} from 'react';
import {useUserManager} from "../../hooks/useUserManager.js";
import {
    Box, Button, CircularProgress,
    Divider, Pagination, Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import ErrorMessage from "../util/ErrorMessage.jsx";

const UserManager = ({urlPath}) => {

    const {
        fetchSuspendedUsers,
        suspendedUsers,
        pageInfo,
        loading,
        liftSuspension
    }= useUserManager(urlPath);

    //현재 페이지 상태 (Spring은 0부터 시작, MUI는 1부터 시작)
    const [currentPage, setCurrentPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setErrorMessage('');
                await fetchSuspendedUsers(currentPage);
            }catch (e) {
                setErrorMessage(e.message);
            }
        }
        loadUsers();
    }, [currentPage,fetchSuspendedUsers]);


    const handlePageChange = (event, value) => {
        // MUI에서 클릭한 페이지 번호(value)는 1부터 시작하므로 -1 해줍니다.
        setCurrentPage(value - 1);
    };

    /* 정지해제 */
    const handleLiftSuspension = async (userId) => {
        if (window.confirm("이 유저의 정지를 해제하시겠습니까?")) {
            try {
                setErrorMessage(''); // 기존 에러 메시지 초기화
                await liftSuspension(userId, currentPage);
            } catch (e) {
                setErrorMessage(e.message);
            }
        }
    }


    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                정지된 유저 관리
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* 에러 발생 시 출력 영역 */}
            <ErrorMessage errorMessage={errorMessage} />

            {/* 유저 목록 테이블 */}
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>유저 ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>닉네임 (이메일)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>정지된 날짜</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>정지 해제일</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">관리</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : suspendedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    현재 정지된 유저가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            suspendedUsers.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.nickname} <br/> <Typography variant="caption" color="text.secondary">{user.email}</Typography></TableCell>
                                    <TableCell>{new Date(user.lastSuspendedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(user.suspendUntil).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            onClick={()=> handleLiftSuspension(user.userId)}
                                        >
                                            정지 해제
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 페이징 컨트롤 */}
            {pageInfo.totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 3, mb: 3 }}>
                    <Pagination
                        count={pageInfo.totalPages}
                        page={currentPage + 1} // MUI는 1부터 렌더링
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            )}
        </Box>
    );
};

export default UserManager;