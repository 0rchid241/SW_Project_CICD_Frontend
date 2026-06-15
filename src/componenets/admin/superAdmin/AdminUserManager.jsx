import React, {useEffect, useState} from 'react';
import {useSuperAdmin} from "../../../hooks/useSuperAdmin.js";
import LoadingCircle from "../../util/LoadingCircle.jsx";
import ErrorMessage from "../../util/ErrorMessage.jsx";

const AdminUserManager = () => {
    const { adminUserList, loading, fetchAdminUsers, revokeAdmin } = useSuperAdmin();

    useEffect(() => {
        fetchAdminUsers();
    }, [fetchAdminUsers]);

    const [errorMessage, setErrorMessage] = useState(``);

    const handleRevoke = async (urlPath, adminId) => {
        if (window.confirm("이 유저의 관리자 권한을 박탈하시겠습니까?")) {
            try {
                await revokeAdmin(urlPath, adminId);
                await fetchAdminUsers();
                alert("권한이 성공적으로 박탈되었습니다.");
            } catch (e) {
                setErrorMessage(e.message);
            }
        }
    };

    if (loading) return <LoadingCircle/>;

    return (
        <div className="dc-write-form-box">
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>게시판 어드민 관리</h3>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
                현재 커뮤니티를 관리 중인 어드민 목록입니다. 지정된 권한을 박탈할 수 있습니다.
            </p>

            <ErrorMessage errorMessage={errorMessage}/>

            <table className="dc-table">
                <thead>
                <tr>
                    <th>유저 ID</th>
                    <th>닉네임</th>
                    <th>게시판</th>
                    <th>URL</th>
                    <th>권한 관리</th>
                </tr>
                </thead>
                <tbody>
                {adminUserList && adminUserList.length > 0 ? (
                    adminUserList.map((admin) => (
                        <tr key={`${admin.userId}-${admin.boardId}`}>
                            <td>{admin.userId}</td>
                            <td>{admin.nickname}</td>
                            <td>{admin.boardName}</td>
                            <td>{admin.boardUrlPath}</td>
                            <td>
                                <button
                                    className="dc-btn dc-btn-sm dc-btn-danger"
                                    onClick={() => handleRevoke(admin.boardUrlPath, admin.userId)}
                                >
                                    권한 박탈
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ padding: '40px', color: '#888' }}>
                            현재 등록된 게시판 관리자가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserManager;