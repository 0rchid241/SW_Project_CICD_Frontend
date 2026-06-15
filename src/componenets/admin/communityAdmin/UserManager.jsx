import React, {useEffect, useState} from 'react';
import {useUserManager} from "../../../hooks/useUserManager.js";
import {Pagination, Stack} from "@mui/material"; // Pagination은 복잡도로 유지
import ErrorMessage from "../../util/ErrorMessage.jsx";

const UserManager = ({urlPath}) => {
    const { fetchSuspendedUsers, suspendedUsers, pageInfo, loading, liftSuspension } = useUserManager(urlPath);
    const [currentPage, setCurrentPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchSuspendedUsers(currentPage);
    }, [currentPage, fetchSuspendedUsers]);

    const handleLiftSuspension = async (userId) => {
        if (window.confirm("이 유저의 정지를 해제하시겠습니까?")) {
            try { await liftSuspension(userId, currentPage); }
            catch (e) { setErrorMessage(e.message); }
        }
    }

    return (
        <div>
            <h2 className="dc-title-sub mb-3">정지된 유저 관리</h2>
            <ErrorMessage errorMessage={errorMessage} />

            <div className="dc-table-container">
                <table className="dc-table">
                    <thead>
                    <tr>
                        <th>유저 ID</th>
                        <th>닉네임 (이메일)</th>
                        <th>정지일</th>
                        <th>해제일</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suspendedUsers.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.nickname}<br/><span style={{ fontSize: '11px', color: '#888' }}>{user.email}</span></td>
                            <td>{new Date(user.lastSuspendedAt).toLocaleDateString()}</td>
                            <td>{new Date(user.suspendUntil).toLocaleDateString()}</td>
                            <td>
                                <button className="dc-btn dc-btn-sm dc-btn-primary" onClick={() => handleLiftSuspension(user.userId)}>정지 해제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {pageInfo.totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination count={pageInfo.totalPages} page={currentPage + 1} onChange={(e, v) => setCurrentPage(v - 1)} color="primary" />
                </Stack>
            )}
        </div>
    );
};

export default UserManager;