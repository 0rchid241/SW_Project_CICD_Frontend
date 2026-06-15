import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useMyPage } from "../../../hooks/useMyPage.js";
import { isAdmin, isSuperAdmin } from "../../util/roleUtils.js";
import MyPosts from "./MyPosts.jsx";
import MyCommentsContainer from "./MyCommentsContainer.jsx";
import useUserAdminAction from "../../../hooks/useUserAdminAction.js";
import ErrorMessage from "../../util/ErrorMessage.jsx";
import UserInfo from "./UserInfo.jsx";

const UserProfilePage = () => {
    const { urlPath, userId: profileUserIdParam } = useParams();
    const { userId: loginUserId, role } = useAuth();
    const { fetchUserProfile } = useMyPage();
    const profileUserId = Number(profileUserIdParam);
    const { warnUser, handleGrantAdmin } = useUserAdminAction({ targetUserId: profileUserId });

    const [profile, setProfile] = useState(null);
    const [activeMenu, setActiveMenu] = useState("INFO");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const isOwner = loginUserId != null && Number(loginUserId) === profileUserId;
    const canManageUser = isAdmin(role) && !isOwner;
    const canGrantAdmin = isSuperAdmin(role) && !isOwner;

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const data = await fetchUserProfile(profileUserId);
                setProfile(data);
            } catch (error) { setErrorMessage(error.message); } finally { setLoading(false); }
        };
        loadUserProfile();
    }, [profileUserId, fetchUserProfile]);

    const renderContent = () => {
        switch (activeMenu) {
            case "INFO": return (
                <>
                    <h2 className="dc-title-main mb-3">{profile?.nickname}님의 페이지</h2>
                    <div className="dc-write-form-box">
                        <h3 style={{ color: '#fff', marginBottom: '16px' }}>유저 정보</h3>
                        <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '2' }}>
                            <p><strong>유저 번호:</strong> {profile?.id}</p>
                            <p><strong>닉네임:</strong> {profile?.nickname}</p>
                        </div>
                    </div>
                </>
            );
            case "POSTS": return <MyPosts userId={profileUserId} title={`${profile?.nickname}님이 작성한 글`}/>;
            case "COMMENTS": return <MyCommentsContainer userId={profileUserId} title={`${profile?.nickname}님의 댓글`} />;
            case "WARNING": return (
                <div className="dc-write-form-box">
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>관리 권한</h3>

                    {/* 경고 부여 섹션 */}
                    <div className="mb-3">
                        <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
                            현재 게시판에서 해당 유저에게 경고를 부여합니다. 경고 누적 시 차단될 수 있습니다.
                        </p>
                        <button className="dc-btn dc-btn-md dc-btn-danger" onClick={warnUser}>
                            경고 부여
                        </button>
                    </div>

                    {/* 관리자 권한 부여 섹션 (Super Admin 전용) */}
                    {canGrantAdmin && (
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #333' }}>
                            <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
                                현재 게시판의 관리자 권한을 부여하여 게시판을 관리할 수 있게 합니다.
                            </p>
                            <button className="dc-btn dc-btn-md dc-btn-outline" onClick={handleGrantAdmin}>
                                게시판 관리자 권한 부여
                            </button>
                        </div>
                    )}
                </div>
            );
            default: return null;
        }
    };

    if (loading) return <div style={{ padding: '40px', color: '#fff' }}>로딩 중...</div>;

    return (
        <div className="dc-mypage-layout">
            <aside className="dc-sidebar">
                <button className={`dc-sidebar-item ${activeMenu === 'INFO' ? 'active' : ''}`} onClick={() => setActiveMenu('INFO')}>유저 정보</button>
                <button className={`dc-sidebar-item ${activeMenu === 'POSTS' ? 'active' : ''}`} onClick={() => setActiveMenu('POSTS')}>작성한 글</button>
                <button className={`dc-sidebar-item ${activeMenu === 'COMMENTS' ? 'active' : ''}`} onClick={() => setActiveMenu('COMMENTS')}>작성한 댓글</button>
                {canManageUser && <button className={`dc-sidebar-item ${activeMenu === 'WARNING' ? 'active' : ''}`} onClick={() => setActiveMenu('WARNING')}>관리</button>}
            </aside>

            <main style={{ flexGrow: 1 }}>
                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
                {successMessage && <div style={{ color: '#52c41a', marginBottom: '16px' }}>{successMessage}</div>}
                {renderContent()}
            </main>
        </div>
    );
};

export default UserProfilePage;