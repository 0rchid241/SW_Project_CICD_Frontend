import React, {useState} from 'react';
import BoardCreateManager from "./BoardCreateManager.jsx";
import AdminUserManager from "./AdminUserManager.jsx";
import {useNavigate} from "react-router-dom";

const SuperAdminDashboard = () => {
    const [activeMenu, setActiveMenu] = useState('CREATE_BOARD');

    const renderContent = () => {
        switch (activeMenu) {
            case 'CREATE_BOARD': return <BoardCreateManager />;
            case 'MANAGE_ADMIN': return <AdminUserManager />;
            default: return <BoardCreateManager />;
        }
    };


    const navigate = useNavigate();


    return (
        <div className="dc-mypage-layout">
            <aside className="dc-sidebar">
                <button
                    className={`dc-sidebar-item ${activeMenu === 'CREATE_BOARD' ? 'active' : ''}`}
                    onClick={() => setActiveMenu('CREATE_BOARD')}
                >
                    커뮤니티 생성
                </button>

                <button
                    className={`dc-sidebar-item ${activeMenu === 'MANAGE_ADMIN' ? 'active' : ''}`}
                    onClick={() => setActiveMenu('MANAGE_ADMIN')}
                >
                    게시판 어드민 관리
                </button>

                <button
                    className={`dc-sidebar-item`}
                    onClick={() => navigate('/ops')}
                >
                    운영페이지로 이동
                </button>
            </aside>

            <main style={{ flexGrow: 1 }}>
                <h2 className="dc-title-main mb-3">SUPER_ADMIN 대시보드</h2>
                {renderContent()}
            </main>
        </div>
    );
};

export default SuperAdminDashboard;