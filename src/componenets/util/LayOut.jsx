import React, { useContext } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import NotificationBadge from "../NotificationBadge.jsx";
import { AuthContext, useAuth } from "../../context/AuthContext.jsx";
import { isSuperAdmin } from "./roleUtils.js";

const LayOut = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const { isLoggedIn, nickname, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212' }}>
            {/* dc-flex-between을 추가하여 네비게이션을 우측 끝으로 보냄 */}
            <header className="dc-global-header dc-flex-between">

                {/* 텍스트 크기를 dc-title-main(28px)으로 변경 */}
                <div className="dc-title-main" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    서경인사이드
                </div>

                <nav className="dc-flex-row gap-2">
                    {!isLoggedIn ? (
                        <>
                            <button className="dc-btn dc-btn-text" onClick={() => navigate('/signup')}>회원가입</button>
                            <button className="dc-btn dc-btn-md dc-btn-primary" onClick={() => navigate('/login')}>로그인</button>
                        </>
                    ) : (
                        <>
                            <button className="dc-btn dc-btn-text" onClick={() => navigate('/me')}>
                                {nickname || "내 정보"}
                            </button>
                            {isSuperAdmin(role) && (
                                <button className="dc-btn dc-btn-text" onClick={() => navigate('/admin/superAdminPage')}>
                                    관리자 페이지
                                </button>
                            )}
                            <button className="dc-btn dc-btn-sm dc-btn-danger" onClick={handleLogout}>로그아웃</button>
                            <NotificationBadge />
                        </>
                    )}
                </nav>
            </header>

            <main style={{ maxWidth: '1200px', margin: '40px auto', width: '100%', padding: '0 16px', flexGrow: 1 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default LayOut;